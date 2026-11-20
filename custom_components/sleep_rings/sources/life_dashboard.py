"""Life Dashboard (https://github.com/owen282000/life-dashboard-ha).

Reads ``sensor.<name>_last_sleep_asleep``: the newest main night, with the
stage timeline in its attributes. Past nights for seeding come from the
integration's in-memory ledger; that is not a public API, so every access is
guarded and a failure simply means "no seed".
"""

from __future__ import annotations

import logging
from collections.abc import Mapping
from datetime import UTC, date, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from ..const import SOURCE_LIFE_DASHBOARD
from ..night import (
    MAX_STAGE_SAMPLES,
    STAGE_ASLEEP,
    STAGE_AWAKE,
    STAGE_CORE,
    STAGE_DEEP,
    STAGE_OUT_OF_BED,
    STAGE_REM,
    STAGE_UNKNOWN,
    HeartRate,
    Night,
    Stage,
    flatten_stages,
    main_nights,
)

_LOGGER = logging.getLogger(__name__)

# Fewer whole hours than this is not enough for a sleeping average.
MIN_HEART_RATE_HOURS = 2

STAGE_MAP = {
    "awake": STAGE_AWAKE,
    "awake_in_bed": STAGE_AWAKE,
    "out_of_bed": STAGE_OUT_OF_BED,
    "light": STAGE_CORE,
    "deep": STAGE_DEEP,
    "rem": STAGE_REM,
    "sleeping": STAGE_ASLEEP,
    "unknown": STAGE_UNKNOWN,
}


def _parse_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)


def _number(value: Any) -> float | None:
    try:
        return float(value)
    except TypeError, ValueError:
        return None


class LifeDashboardSource:
    """Adapter for the Life Dashboard integration."""

    key = SOURCE_LIFE_DASHBOARD

    def matches(self, state: State) -> bool:
        """Return True for an entity with Life Dashboard's sleep attributes."""
        attributes = state.attributes
        return all(key in attributes for key in ("night", "start", "end", "asleep_minutes"))

    def night_from_state(self, state: State) -> Night | None:
        """Build a night from the entity's attributes."""
        attributes = state.attributes
        start = _parse_datetime(attributes.get("start"))
        end = _parse_datetime(attributes.get("end"))
        asleep = _number(attributes.get("asleep_minutes"))
        try:
            wake_date = date.fromisoformat(str(attributes.get("night")))
        except ValueError:
            return None
        if start is None or end is None or asleep is None or end <= start:
            return None

        samples: list[Stage] = []
        raw_stages = attributes.get("stages")
        for item in raw_stages[:MAX_STAGE_SAMPLES] if isinstance(raw_stages, list) else []:
            if not isinstance(item, Mapping):
                continue
            stage = STAGE_MAP.get(str(item.get("stage")))
            stage_start = _parse_datetime(item.get("start"))
            stage_end = _parse_datetime(item.get("end"))
            if stage and stage_start and stage_end and stage_end > stage_start:
                samples.append(Stage(stage, stage_start, stage_end))

        return Night(
            wake_date=wake_date,
            start=start,
            end=end,
            asleep_minutes=asleep,
            awake_minutes=_number(attributes.get("awake_minutes")),
            stages=flatten_stages(samples),
        )

    async def async_past_nights(self, hass: HomeAssistant, entity_id: str) -> list[Night]:
        """Read earlier nights from Life Dashboard's ledger, if it is reachable."""
        try:
            return self._past_nights(hass, entity_id)
        except Exception:  # noqa: BLE001 - undocumented internals may change shape
            _LOGGER.debug("Could not read past nights from Life Dashboard", exc_info=True)
            return []

    async def async_heart_rate(
        self, hass: HomeAssistant, entity_id: str, start: datetime, end: datetime
    ) -> HeartRate | None:
        """Average the hourly heart rate statistics that lie fully inside the night.

        Life Dashboard keeps heart rate as an hourly long-term statistic
        (``life_dashboard:<entry id>_heart_rate``). Only whole hours between
        falling asleep and waking count, so dozing off and getting up do not.
        """
        if "recorder" not in hass.config.components:
            return None
        registry_entry = er.async_get(hass).async_get(entity_id)
        if registry_entry is None or registry_entry.config_entry_id is None:
            return None
        # Imported here: the recorder is an optional dependency.
        from homeassistant.components.recorder import get_instance  # noqa: PLC0415
        from homeassistant.components.recorder.statistics import (  # noqa: PLC0415
            statistics_during_period,
        )

        statistic_id = f"life_dashboard:{registry_entry.config_entry_id.lower()}_heart_rate"
        result = await get_instance(hass).async_add_executor_job(
            statistics_during_period,
            hass,
            start - timedelta(hours=1),
            end + timedelta(hours=1),
            {statistic_id},
            "hour",
            None,
            {"mean", "min", "max"},
        )
        # Every hour that touches the night is listed (for the chart); only the
        # hours that lie completely inside it count towards the average and low.
        rows = [
            row
            for row in result.get(statistic_id, [])
            if row.get("mean") is not None
            and row["end"] > start.timestamp()
            and row["start"] < end.timestamp()
        ]
        whole = [
            row
            for row in rows
            if row["start"] >= start.timestamp() and row["end"] <= end.timestamp()
        ]
        if len(whole) < MIN_HEART_RATE_HOURS:
            return None

        def low(row: dict) -> float:
            return row["min"] if row.get("min") is not None else row["mean"]

        def high(row: dict) -> float:
            return row["max"] if row.get("max") is not None else row["mean"]

        return HeartRate(
            average=sum(row["mean"] for row in whole) / len(whole),
            lowest=min(low(row) for row in whole),
            hours=tuple(
                {
                    "start": datetime.fromtimestamp(row["start"], UTC).isoformat(),
                    "mean": round(row["mean"], 1),
                    "min": round(low(row), 1),
                    "max": round(high(row), 1),
                    # The first and last hour usually include some time awake.
                    **({} if row in whole else {"partial": True}),
                }
                for row in rows
            ),
        )

    def _past_nights(self, hass: HomeAssistant, entity_id: str) -> list[Night]:
        registry_entry = er.async_get(hass).async_get(entity_id)
        if registry_entry is None or registry_entry.config_entry_id is None:
            return []
        entry = hass.config_entries.async_get_entry(registry_entry.config_entry_id)
        sleep = entry.runtime_data.history.ledger.sleep  # type: ignore[union-attr]
        stage_samples: Mapping[str, list] = sleep.get("stages") or {}

        sessions: list[Night] = []
        for identity, record in (sleep.get("nights") or {}).items():
            start = datetime.fromtimestamp(float(record["start"]), UTC)
            end = datetime.fromtimestamp(float(record["end"]), UTC)
            samples = [
                Stage(
                    STAGE_MAP[str(sample[0])],
                    datetime.fromtimestamp(float(sample[1]), UTC),
                    datetime.fromtimestamp(float(sample[2]), UTC),
                )
                for sample in stage_samples.get(identity, [])[:MAX_STAGE_SAMPLES]
                if str(sample[0]) in STAGE_MAP
            ]
            sessions.append(
                Night(
                    wake_date=date.fromisoformat(str(record["day"])),
                    start=start,
                    end=end,
                    asleep_minutes=float(record.get("asleep") or 0),
                    awake_minutes=_number(record.get("awake")),
                    stages=flatten_stages(samples),
                )
            )
        return main_nights(sessions)
