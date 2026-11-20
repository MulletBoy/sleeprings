"""Night logic tests (synthetic nights only)."""

from dataclasses import replace
from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from custom_components.sleep_rings.night import (
    MAX_STAGE_SAMPLES,
    Night,
    Stage,
    awake_stretches,
    flatten_stages,
    main_night,
    main_nights,
    measure,
    sanitize_night,
    score_measurements,
    sleep_window,
)

T0 = datetime(2030, 3, 9, 13, 0, tzinfo=UTC)  # 13:00 UTC


def _stages(*parts: tuple[str, float]) -> tuple[Stage, ...]:
    """Build back-to-back stages from (stage, minutes) pairs starting at T0."""
    out, at = [], T0
    for stage, minutes in parts:
        end = at + timedelta(minutes=minutes)
        out.append(Stage(stage, at, end))
        at = end
    return tuple(out)


def _night(stages=(), asleep=420.0, awake=None, wake=date(2030, 3, 10), hours=8.0):
    end = stages[-1].end if stages else T0 + timedelta(hours=hours)
    return Night(wake, T0, end, asleep, awake, stages)


def test_main_night_beats_nap():
    night = _night(asleep=400)
    nap = _night(asleep=45, hours=1)
    assert main_night([nap, night]) is night
    assert main_night([]) is None


def test_main_nights_one_per_wake_date_sorted():
    a = _night(asleep=400, wake=date(2030, 3, 11))
    a_nap = _night(asleep=30, wake=date(2030, 3, 11))
    b = _night(asleep=380, wake=date(2030, 3, 10))
    assert main_nights([a, a_nap, b]) == [b, a]


def test_sleep_window_skips_time_in_bed_before_and_after():
    stages = _stages(("awake", 12), ("core", 200), ("awake", 5), ("rem", 60), ("awake", 9))
    onset, final_wake = sleep_window(_night(stages))
    assert onset == T0 + timedelta(minutes=12)
    assert final_wake == T0 + timedelta(minutes=277)
    assert awake_stretches(_night(stages)) == [5]


def test_wakeups_need_point_nine_minutes_but_all_awake_minutes_count():
    stages = _stages(
        ("core", 100),
        ("awake", 0.5),
        ("deep", 60),
        ("awake", 0.9),
        ("rem", 60),
        ("out_of_bed", 4),
        ("core", 100),
    )
    m = measure(_night(stages), UTC)
    assert m.wakeups == 2
    assert m.minutes_awake == pytest.approx(5.4)
    assert m.has_stages


def test_without_stages_uses_reported_awake_minutes():
    m = measure(_night(asleep=450, awake=22), UTC)
    assert (m.wakeups, m.minutes_awake, m.has_stages) == (0, 22, False)
    assert m.hours_asleep == 7.5
    assert m.onset == T0


def test_onset_is_in_the_local_time_of_the_night():
    night = _night(_stages(("core", 400)))
    # 13:00 UTC is midnight in Sydney (UTC+11 in March) and 20:00 in Bangkok.
    assert measure(night, ZoneInfo("Australia/Sydney")).onset_minutes == 720
    assert measure(night, ZoneInfo("Asia/Bangkok")).onset_minutes == 480


def test_score_from_measurements():
    night = _night(_stages(("core", 300), ("awake", 6), ("rem", 145)), asleep=445)
    m = measure(night, ZoneInfo("Australia/Sydney"))
    # Usual onset 26 minutes later than tonight's: 26 minutes early is free.
    result = score_measurements(m, [m.onset_minutes + 26] * 13)
    assert result.bedtime_deviation == -26
    assert (round(result.duration, 1), result.bedtime, result.interruptions) == (47.6, 30, 20)
    assert result.score == 98
    assert result.band == "very_high"


def test_first_night_has_no_deviation():
    m = measure(_night(asleep=498), UTC)
    result = score_measurements(m, [])
    assert result.bedtime_deviation is None
    assert result.score == 100


def test_implausible_nights_are_dropped():
    good = _night(_stages(("core", 400)), asleep=400)
    assert sanitize_night(good) is not None
    assert sanitize_night(replace(good, asleep_minutes=float("nan"))) is None
    assert sanitize_night(replace(good, asleep_minutes=float("inf"))) is None
    assert sanitize_night(replace(good, asleep_minutes=-5)) is None
    assert sanitize_night(replace(good, asleep_minutes=5000)) is None
    assert sanitize_night(replace(good, end=good.start + timedelta(days=4))) is None
    assert sanitize_night(replace(good, end=good.start)) is None
    assert sanitize_night(replace(good, wake_date=date(2099, 1, 1))) is None
    assert sanitize_night(replace(good, start=datetime(2030, 3, 9, 13, 0))) is None
    # A bad awake total is dropped without losing the night.
    assert sanitize_night(replace(good, awake_minutes=float("nan"))).awake_minutes is None


def test_stages_are_clipped_to_the_session_and_capped():
    night = _night(_stages(("core", 400)), asleep=400)
    stray = Stage("deep", datetime(1970, 1, 1, tzinfo=UTC), datetime(2100, 1, 1, tzinfo=UTC))
    cleaned = sanitize_night(replace(night, stages=(*night.stages, stray)))
    assert all(night.start <= s.start < s.end <= night.end for s in cleaned.stages)

    many = tuple(
        Stage("core", T0 + timedelta(seconds=n), T0 + timedelta(seconds=n + 1)) for n in range(5000)
    )
    assert len(flatten_stages(many)) <= MAX_STAGE_SAMPLES
    assert len(sanitize_night(replace(night, stages=many)).stages) <= MAX_STAGE_SAMPLES
