"""Long-term statistics dated by the night they belong to.

The sensors' own statistics are stamped when a night arrives, so a history
import or a late sync lands on the wrong day. These external statistics put
each night's score at noon of its wake date instead.
"""

from __future__ import annotations

from datetime import date, datetime, time

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.models import (
    StatisticData,
    StatisticMeanType,
    StatisticMetaData,
)
from homeassistant.components.recorder.statistics import async_add_external_statistics
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .manager import NightRecord, SleepRingsManager

STATISTICS = (
    ("score", "Sleep score", "score"),
    ("duration_points", "Duration points", "duration"),
    ("bedtime_points", "Bedtime points", "bedtime"),
    ("interruptions_points", "Interruptions points", "interruptions"),
)


def statistic_id(entry_id: str, key: str) -> str:
    """Return the id of one of an entry's statistics."""
    return f"{DOMAIN}:{entry_id.lower()}_{key}"


def _start(record: NightRecord) -> datetime:
    noon = datetime.combine(
        date.fromisoformat(record.night), time(12), tzinfo=dt_util.DEFAULT_TIME_ZONE
    )
    # Statistics rows must start on a full hour in UTC.
    return dt_util.as_utc(noon).replace(minute=0, second=0, microsecond=0)


@callback
def async_clear_statistics(hass: HomeAssistant, entry_id: str) -> None:
    """Delete an entry's statistics from the recorder."""
    if "recorder" not in hass.config.components:
        return
    get_instance(hass).async_clear_statistics(
        [statistic_id(entry_id, key) for key, _name, _field in STATISTICS]
    )


@callback
def async_import_statistics(hass: HomeAssistant, manager: SleepRingsManager) -> None:
    """Write every stored night to the recorder (existing rows are replaced)."""
    if "recorder" not in hass.config.components:
        return
    records = [record for record in manager.records.values() if record.score is not None]
    if not records:
        return
    for key, name, field in STATISTICS:
        metadata = StatisticMetaData(
            mean_type=StatisticMeanType.ARITHMETIC,
            has_sum=False,
            name=f"{manager.entry.title} {name}",
            source=DOMAIN,
            statistic_id=statistic_id(manager.entry.entry_id, key),
            unit_class=None,
            unit_of_measurement=None,
        )
        rows = []
        for record in records:
            value = float(getattr(record, field))
            rows.append(StatisticData(start=_start(record), mean=value, min=value, max=value))
        async_add_external_statistics(hass, metadata, rows)
