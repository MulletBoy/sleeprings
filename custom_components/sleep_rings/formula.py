"""Sleep score model.

Pure Python, no Home Assistant imports, so the model can be refitted and
tested on its own. All tunable numbers live in ``Constants``; when the
defaults change, bump ``MODEL_VERSION``.

The model is a fit to the per-night measurements and points shown by the
Apple Health app. It is not Apple's code. Apple publishes only the structure:
duration 50 + bedtime consistency 30 + interruptions 20.
"""

from __future__ import annotations

from collections.abc import Iterable
from dataclasses import asdict, dataclass, fields
from datetime import datetime
from math import isfinite, sqrt
from typing import Any

MODEL_VERSION = "v5"

MINUTES_PER_DAY = 1440
NOON_MINUTES = 720

BAND_VERY_LOW = "very_low"
BAND_LOW = "low"
BAND_OK = "ok"
BAND_HIGH = "high"
BAND_VERY_HIGH = "very_high"
BANDS = (BAND_VERY_LOW, BAND_LOW, BAND_OK, BAND_HIGH, BAND_VERY_HIGH)


@dataclass(frozen=True, slots=True)
class Constants:
    """Every tunable number of the model (v5 defaults)."""

    # Duration (max 50)
    duration_max: float = 50.0
    duration_full_hours: float = 8.3  # full points at or above this
    duration_coeff: float = 3.1  # points lost = coeff * shortfall_hours ** power
    duration_power: float = 2.0

    # Bedtime consistency (max 30), against the mean onset of earlier nights
    bedtime_max: float = 30.0
    bedtime_history_nights: int = 13
    bedtime_late_free_minutes: float = 17.0
    bedtime_late_per_minute: float = 0.225
    bedtime_early_free_minutes: float = 40.0
    bedtime_early_coeff: float = 0.4  # points lost = coeff * sqrt(minutes beyond free)

    # Interruptions (max 20)
    interruptions_max: float = 20.0
    wakeups_free: float = 3.0
    wakeup_points: float = 1.2
    awake_free_minutes: float = 16.0
    awake_points_per_minute: float = 0.08
    wakeup_min_minutes: float = 0.9  # an awake stretch this long counts as a wake-up

    # Lower bounds of the bands above "very low" (watchOS 26.2)
    band_low: int = 41
    band_ok: int = 61
    band_high: int = 81
    band_very_high: int = 96

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> Constants:
        """Build from a partial mapping.

        Only the tunable fields in ``LIMITS`` are taken. Values that are not
        finite numbers are ignored and the rest are clamped to their limits,
        so stored options can never produce a formula that divides by zero,
        overflows or leaves the 0 to 100 range.
        """
        known = {f.name: f.type for f in fields(cls)}
        picked: dict[str, Any] = {}
        for key, value in (data or {}).items():
            if key not in LIMITS:
                continue
            try:
                number = float(value)
            except TypeError, ValueError:
                continue
            if not isfinite(number):
                continue
            low, high = LIMITS[key]
            number = min(high, max(low, number))
            picked[key] = round(number) if known[key] == "int" else number
        return cls(**picked)

    def as_dict(self) -> dict[str, Any]:
        """Return the constants as a plain dict."""
        return asdict(self)


DEFAULTS = Constants()

# Allowed range of every tunable constant. The part maximums (50 / 30 / 20) are
# the published structure of the score and are not tunable.
LIMITS: dict[str, tuple[float, float]] = {
    "duration_full_hours": (4.0, 12.0),
    "duration_coeff": (0.0, 20.0),
    "duration_power": (0.5, 4.0),
    "bedtime_history_nights": (1, 60),
    "bedtime_late_free_minutes": (0.0, 240.0),
    "bedtime_late_per_minute": (0.0, 5.0),
    "bedtime_early_free_minutes": (0.0, 240.0),
    "bedtime_early_coeff": (0.0, 10.0),
    "wakeups_free": (0.0, 30.0),
    "wakeup_points": (0.0, 20.0),
    "awake_free_minutes": (0.0, 240.0),
    "awake_points_per_minute": (0.0, 5.0),
    "wakeup_min_minutes": (0.0, 30.0),
    "band_low": (1, 100),
    "band_ok": (1, 100),
    "band_high": (1, 100),
    "band_very_high": (1, 100),
}


@dataclass(frozen=True, slots=True)
class ScoreResult:
    """Score of one night. Component values are unrounded."""

    score: int
    duration: float
    bedtime: float
    interruptions: float
    band: str
    # Minutes relative to the usual onset (+ later, - earlier); None without history.
    bedtime_deviation: float | None
    model_version: str = MODEL_VERSION


def duration_points(hours_asleep: float, c: Constants = DEFAULTS) -> float:
    """Points for time actually asleep (not time in bed)."""
    shortfall = max(0.0, c.duration_full_hours - hours_asleep)
    points = c.duration_max - c.duration_coeff * shortfall**c.duration_power
    return min(c.duration_max, max(0.0, points))


def bedtime_points(deviation_minutes: float | None, c: Constants = DEFAULTS) -> float:
    """Points for falling asleep close to the usual time.

    ``deviation_minutes`` is onset minus the mean onset of the earlier nights:
    positive is later, negative earlier. Later costs far more than earlier.
    With no history (None) there is nothing to deviate from: full points.
    """
    if deviation_minutes is None:
        return c.bedtime_max
    if deviation_minutes > 0:
        late = max(0.0, deviation_minutes - c.bedtime_late_free_minutes)
        return min(c.bedtime_max, max(0.0, c.bedtime_max - c.bedtime_late_per_minute * late))
    early = max(0.0, -deviation_minutes - c.bedtime_early_free_minutes)
    return min(c.bedtime_max, max(0.0, c.bedtime_max - c.bedtime_early_coeff * sqrt(early)))


def interruption_points(wakeups: int, minutes_awake: float, c: Constants = DEFAULTS) -> float:
    """Points for how often and how long the night was interrupted."""
    points = (
        c.interruptions_max
        - c.wakeup_points * max(0.0, wakeups - c.wakeups_free)
        - c.awake_points_per_minute * max(0.0, minutes_awake - c.awake_free_minutes)
    )
    return min(c.interruptions_max, max(0.0, points))


def band_for(score: int, c: Constants = DEFAULTS) -> str:
    """Return the band key for a total score."""
    if score >= c.band_very_high:
        return BAND_VERY_HIGH
    if score >= c.band_high:
        return BAND_HIGH
    if score >= c.band_ok:
        return BAND_OK
    if score >= c.band_low:
        return BAND_LOW
    return BAND_VERY_LOW


def onset_minutes(local_onset: datetime) -> int:
    """Minutes after noon of a local wall-clock time.

    Counting from noon keeps 23:30 and 00:30 next to each other (690 and 750),
    so bedtimes average correctly across midnight. Pass the time already
    converted to the timezone where the person slept.
    """
    minutes = local_onset.hour * 60 + local_onset.minute
    return (minutes - NOON_MINUTES) % MINUTES_PER_DAY


def bedtime_deviation(
    onset: float, previous_onsets: Iterable[float], c: Constants = DEFAULTS
) -> float | None:
    """Onset minus the mean of the last N earlier onsets (all minutes after noon)."""
    recent = list(previous_onsets)[-c.bedtime_history_nights :]
    if not recent:
        return None
    return onset - sum(recent) / len(recent)


def score_night(
    hours_asleep: float,
    deviation_minutes: float | None,
    wakeups: int,
    minutes_awake: float,
    c: Constants = DEFAULTS,
) -> ScoreResult:
    """Score one night from its four measurements."""
    d = duration_points(hours_asleep, c)
    b = bedtime_points(deviation_minutes, c)
    i = interruption_points(wakeups, minutes_awake, c)
    total = min(100, max(0, round(d + b + i)))
    return ScoreResult(
        score=total,
        duration=d,
        bedtime=b,
        interruptions=i,
        band=band_for(total, c),
        bedtime_deviation=deviation_minutes,
    )
