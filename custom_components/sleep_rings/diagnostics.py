"""Diagnostics for SleepRings.

Diagnostics files get attached to public bug reports, so this deliberately
leaves out anything personal: no sleep or wake times, no bedtimes, no heart
rate, no time zone, and entity ids (which usually contain a name) are redacted.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .const import CONF_SLEEP_ENTITY, CONF_TIME_ZONE_ENTITY
from .formula import MODEL_VERSION
from .manager import SleepRingsConfigEntry

TO_REDACT = {CONF_SLEEP_ENTITY, CONF_TIME_ZONE_ENTITY}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: SleepRingsConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    manager = entry.runtime_data
    latest = manager.latest
    records = list(manager.records.values())
    return {
        "model_version": MODEL_VERSION,
        "data": async_redact_data(dict(entry.data), TO_REDACT),
        "options": async_redact_data(dict(entry.options), TO_REDACT),
        "constants": manager.constants.as_dict(),
        "nights_stored": len(records),
        "nights_seeded": sum(r.seeded for r in records),
        "nights_with_stages": sum(r.has_stages for r in records),
        "nights_with_heart_rate": sum(r.heart_rate_average is not None for r in records),
        "time_zone_known": manager.last_time_zone is not None,
        "latest": (
            {
                "score": latest.score,
                "duration_points": round(latest.duration, 1),
                "bedtime_points": round(latest.bedtime, 1),
                "interruptions_points": round(latest.interruptions, 1),
                "band": latest.band,
                "has_stages": latest.has_stages,
                "seeded": latest.seeded,
                "has_bedtime_history": latest.deviation is not None,
                "stage_segments": len(manager.stages),
                "heart_rate_hours": len(manager.heart_rate_hours),
            }
            if latest
            else None
        ),
    }
