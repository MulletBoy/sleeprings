"""Model tests against the public calibration table.

Each row is one night as shown by the Apple Health app: time asleep, bedtime
against the 13-night average (minutes, + later / - earlier), wake-ups, minutes
awake, then Apple's points for duration / bedtime / interruptions / total.
Nights are numbered, not dated, and sorted by Apple's total.
"""

from datetime import datetime

import pytest

from custom_components.sleep_rings.formula import (
    BAND_HIGH,
    BAND_LOW,
    BAND_OK,
    BAND_VERY_HIGH,
    BAND_VERY_LOW,
    MODEL_VERSION,
    Constants,
    band_for,
    bedtime_deviation,
    bedtime_points,
    duration_points,
    interruption_points,
    onset_minutes,
    score_night,
)

# (asleep h, asleep m, deviation min, wake-ups, awake min, D, B, I, total)
CALIBRATION = [
    (5, 32, 137, 3, 6, 26, 3, 19, 48),
    (6, 8, 88, 1, 1, 35, 14, 20, 69),
    (6, 6, 80, 2, 5, 35, 16, 20, 71),
    (6, 25, 35, 1, 5, 39, 26, 20, 85),
    (6, 55, -11, 8, 20, 45, 30, 13, 88),
    (6, 50, 2, 6, 33, 44, 30, 15, 89),
    (7, 6, 41, 5, 14, 46, 25, 18, 89),
    (6, 35, -4, 4, 10, 41, 30, 19, 90),
    (10, 10, -264, 5, 13, 50, 24, 18, 92),
    (7, 44, -20, 5, 15, 48, 30, 18, 96),
    (7, 29, 19, 2, 6, 47, 29, 20, 97),
    (9, 22, -85, 2, 2, 50, 27, 20, 97),
    (7, 45, -40, 5, 21, 49, 30, 18, 97),
    (7, 25, -26, 2, 7, 47, 30, 20, 97),
]


def _score(row):
    h, m, dev, wakeups, awake, *_ = row
    return score_night(h + m / 60, dev, wakeups, awake)


@pytest.mark.parametrize("row", CALIBRATION)
def test_total_within_one_point(row):
    assert abs(_score(row).score - row[8]) <= 1


@pytest.mark.parametrize("row", CALIBRATION)
def test_parts_within_about_one_point(row):
    result = _score(row)
    assert abs(result.duration - row[5]) <= 1.1
    assert abs(result.bedtime - row[6]) <= 1.1
    assert abs(result.interruptions - row[7]) <= 1.1


def test_totals_exact_on_eight_of_fourteen():
    exact = sum(_score(row).score == row[8] for row in CALIBRATION)
    assert exact == 8


def test_public_data_point_46_minutes_late():
    assert bedtime_points(46) == pytest.approx(23.475)


def test_duration_cap_and_floor():
    assert duration_points(8.3) == 50
    assert duration_points(12) == 50
    assert duration_points(0) == 0
    assert duration_points(7) == pytest.approx(50 - 3.1 * 1.3**2)


def test_bedtime_free_zones_and_floor():
    assert bedtime_points(17) == 30
    assert bedtime_points(-40) == 30
    assert bedtime_points(0) == 30
    assert bedtime_points(None) == 30
    assert bedtime_points(600) == 0
    # Early is much cheaper than late.
    assert bedtime_points(-120) > bedtime_points(120)


def test_interruptions_free_zones_and_floor():
    assert interruption_points(3, 16) == 20
    assert interruption_points(4, 16) == pytest.approx(18.8)
    assert interruption_points(0, 26) == pytest.approx(19.2)
    assert interruption_points(40, 300) == 0


@pytest.mark.parametrize(
    ("score", "band"),
    [
        (0, BAND_VERY_LOW),
        (40, BAND_VERY_LOW),
        (41, BAND_LOW),
        (60, BAND_LOW),
        (61, BAND_OK),
        (80, BAND_OK),
        (81, BAND_HIGH),
        (95, BAND_HIGH),
        (96, BAND_VERY_HIGH),
        (100, BAND_VERY_HIGH),
    ],
)
def test_bands(score, band):
    assert band_for(score) == band


def test_onsets_average_across_midnight():
    before = onset_minutes(datetime(2000, 1, 1, 23, 30))
    after = onset_minutes(datetime(2000, 1, 2, 0, 30))
    assert (before, after) == (690, 750)
    assert bedtime_deviation(720, [before, after]) == 0


def test_deviation_uses_last_13_and_handles_no_history():
    onsets = [0] * 5 + [600] * 13
    assert bedtime_deviation(630, onsets) == 30
    assert bedtime_deviation(630, []) is None


def test_constants_are_configurable():
    custom = Constants.from_dict({"duration_full_hours": 7.5, "bogus": 1})
    assert duration_points(7.5, custom) == 50
    assert duration_points(7.5) < 50
    assert custom.bedtime_history_nights == 13
    assert MODEL_VERSION == "v5"


def test_constants_cannot_break_the_formula():
    # Out-of-range and non-numeric values are clamped or ignored.
    c = Constants.from_dict(
        {
            "duration_power": -1,
            "wakeup_points": -5,
            "bedtime_history_nights": 0,
            "awake_points_per_minute": float("nan"),
            "duration_coeff": float("inf"),
            "duration_max": 500,
            "band_ok": "abc",
        }
    )
    assert c.duration_power == 0.5
    assert c.wakeup_points == 0
    assert c.bedtime_history_nights == 1
    assert c.awake_points_per_minute == 0.08
    assert c.duration_coeff == 3.1
    assert c.duration_max == 50
    assert c.band_ok == 61
    for hours in (0, 3, 8.3, 20):
        for deviation in (-600, 0, 600):
            result = score_night(hours, deviation, 40, 300, c)
            assert 0 <= result.score <= 100
            assert 0 <= result.duration <= 50
            assert 0 <= result.bedtime <= 30
            assert 0 <= result.interruptions <= 20
