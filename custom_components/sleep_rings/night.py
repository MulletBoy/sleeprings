"""Night data model and the measurements the score needs.

Pure Python, no Home Assistant imports. A source adapter turns whatever its
integration provides into ``Night`` objects; everything after that is the same
for every source.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta, tzinfo
from math import isfinite

from .formula import (
    DEFAULTS,
    Constants,
    ScoreResult,
    bedtime_deviation,
    onset_minutes,
    score_night,
)

STAGE_AWAKE = "awake"
STAGE_OUT_OF_BED = "out_of_bed"
STAGE_CORE = "core"
STAGE_DEEP = "deep"
STAGE_REM = "rem"
STAGE_ASLEEP = "asleep"  # asleep, stage not known
STAGE_UNKNOWN = "unknown"

ASLEEP_STAGES = frozenset({STAGE_CORE, STAGE_DEEP, STAGE_REM, STAGE_ASLEEP})
AWAKE_STAGES = frozenset({STAGE_AWAKE, STAGE_OUT_OF_BED})

# When samples overlap (two apps, or "asleep" under a staged sample), the
# more specific stage wins.
# Limits on what a source may hand over (see ``sanitize_night``).
MAX_STAGE_SAMPLES = 1000
MAX_NIGHT = timedelta(hours=36)
MIN_YEAR, MAX_YEAR = 2000, 2200

STAGE_PRIORITY = (
    STAGE_DEEP,
    STAGE_REM,
    STAGE_CORE,
    STAGE_ASLEEP,
    STAGE_AWAKE,
    STAGE_OUT_OF_BED,
    STAGE_UNKNOWN,
)


@dataclass(frozen=True, slots=True)
class Stage:
    """One stretch of a single sleep stage. Datetimes are timezone-aware."""

    stage: str
    start: datetime
    end: datetime

    @property
    def minutes(self) -> float:
        """Length in minutes."""
        return (self.end - self.start).total_seconds() / 60


@dataclass(frozen=True, slots=True)
class Night:
    """One sleep session as delivered by a source.

    ``wake_date`` is the day the person woke up; a night belongs to that day.
    ``asleep_minutes`` is time actually asleep, not time in bed.
    ``awake_minutes`` is only used when there are no stages.
    """

    wake_date: date
    start: datetime
    end: datetime
    asleep_minutes: float
    awake_minutes: float | None = None
    stages: tuple[Stage, ...] = field(default_factory=tuple)


@dataclass(frozen=True, slots=True)
class HeartRate:
    """Heart rate while asleep, for one night."""

    average: float
    lowest: float
    # Every hour that touches the night, each
    # {"start": ISO time, "mean": bpm, "min": bpm, "max": bpm}, plus
    # "partial": True when the hour is not completely inside the night.
    hours: tuple[dict[str, float | str], ...] = ()


@dataclass(frozen=True, slots=True)
class Measurements:
    """What the score is calculated from, for one night."""

    wake_date: date
    hours_asleep: float
    onset: datetime  # first moment asleep, timezone-aware
    onset_minutes: int  # minutes after noon, in the night's local time
    wakeups: int
    minutes_awake: float
    has_stages: bool


def flatten_stages(samples: Iterable[Stage]) -> tuple[Stage, ...]:
    """Turn possibly overlapping samples into a clean timeline.

    The result is sorted, has no overlaps, and adjacent stretches of the same
    stage are merged. Stages not in ``STAGE_PRIORITY`` are dropped.
    """
    rank = {stage: index for index, stage in enumerate(STAGE_PRIORITY)}
    known = [s for s in samples if s.stage in rank and s.end > s.start][:MAX_STAGE_SAMPLES]
    edges = sorted({t for s in known for t in (s.start, s.end)})
    timeline: list[Stage] = []
    for start, end in zip(edges, edges[1:], strict=False):
        active = [s.stage for s in known if s.start <= start and s.end >= end]
        if not active:
            continue
        stage = min(active, key=rank.__getitem__)
        if timeline and timeline[-1].stage == stage and timeline[-1].end == start:
            timeline[-1] = Stage(stage, timeline[-1].start, end)
        else:
            timeline.append(Stage(stage, start, end))
    return tuple(timeline)


def sanitize_night(night: Night) -> Night | None:
    """Return the night if it is plausible, with its stages clipped to the session.

    Sources hand over whatever they were sent. A night with impossible values
    (not a number, a week long, dated years ahead) is dropped here so it can
    never be stored, become the "newest" night forever, or stall a dashboard.
    """
    try:
        if night.start.tzinfo is None or night.end.tzinfo is None:
            return None
        if (
            not MIN_YEAR <= night.start.year <= MAX_YEAR
            or not MIN_YEAR <= night.end.year <= MAX_YEAR
        ):
            return None
        length = night.end - night.start
        if not timedelta(0) < length <= MAX_NIGHT:
            return None
        asleep = float(night.asleep_minutes)
        if not isfinite(asleep) or not 0 <= asleep <= MAX_NIGHT.total_seconds() / 60:
            return None
        if abs((night.wake_date - night.end.date()).days) > 1:
            return None
        awake = night.awake_minutes
        if awake is not None:
            awake = float(awake)
            if not isfinite(awake) or not 0 <= awake <= MAX_NIGHT.total_seconds() / 60:
                awake = None
        stages = tuple(
            Stage(s.stage, max(s.start, night.start), min(s.end, night.end))
            for s in night.stages[:MAX_STAGE_SAMPLES]
            if s.end > night.start and s.start < night.end
        )
    except TypeError, ValueError, OverflowError:
        return None
    return Night(night.wake_date, night.start, night.end, asleep, awake, stages)


def main_night(sessions: Iterable[Night]) -> Night | None:
    """Pick the main night among sessions of one wake date (naps lose).

    The session with the most time asleep wins; ties go to the longer one.
    """
    return max(
        sessions,
        key=lambda n: (n.asleep_minutes, n.end - n.start),
        default=None,
    )


def main_nights(sessions: Iterable[Night]) -> list[Night]:
    """Reduce sessions to one main night per wake date, oldest first."""
    by_date: dict[date, list[Night]] = {}
    for session in sessions:
        by_date.setdefault(session.wake_date, []).append(session)
    nights = (main_night(group) for group in by_date.values())
    return sorted((n for n in nights if n), key=lambda n: n.wake_date)


def sleep_window(night: Night) -> tuple[datetime, datetime]:
    """From first falling asleep to the final wake-up.

    Uses the stages when there are any, so time in bed before falling asleep
    and after the final wake-up is left out. Otherwise the session itself.
    """
    asleep = [s for s in night.stages if s.stage in ASLEEP_STAGES]
    if not asleep:
        return night.start, night.end
    return min(s.start for s in asleep), max(s.end for s in asleep)


def awake_stretches(night: Night) -> list[float]:
    """Minutes of each awake/out-of-bed stretch inside the sleep window."""
    onset, final_wake = sleep_window(night)
    stretches: list[float] = []
    for stage in sorted(night.stages, key=lambda s: s.start):
        if stage.stage not in AWAKE_STAGES:
            continue
        start, end = max(stage.start, onset), min(stage.end, final_wake)
        if end > start:
            stretches.append((end - start).total_seconds() / 60)
    return stretches


def measure(night: Night, local_tz: tzinfo, c: Constants = DEFAULTS) -> Measurements:
    """Take the score's measurements from a night.

    ``local_tz`` is the timezone where the person slept. Bedtimes are compared
    in each night's own local time, so a trip abroad does not distort the
    average: the result's ``onset_minutes`` is already converted and is what
    should be stored.
    """
    onset, _ = sleep_window(night)
    stretches = awake_stretches(night)
    if night.stages:
        wakeups = sum(m >= c.wakeup_min_minutes for m in stretches)
        minutes_awake = sum(stretches)
    else:
        wakeups = 0
        minutes_awake = night.awake_minutes or 0.0
    return Measurements(
        wake_date=night.wake_date,
        hours_asleep=night.asleep_minutes / 60,
        onset=onset,
        onset_minutes=onset_minutes(onset.astimezone(local_tz)),
        wakeups=wakeups,
        minutes_awake=minutes_awake,
        has_stages=bool(night.stages),
    )


def score_measurements(
    m: Measurements, previous_onsets: Iterable[float], c: Constants = DEFAULTS
) -> ScoreResult:
    """Score a night against the onsets of the nights before it (oldest first)."""
    deviation = bedtime_deviation(m.onset_minutes, previous_onsets, c)
    return score_night(m.hours_asleep, deviation, m.wakeups, m.minutes_awake, c)
