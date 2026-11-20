"""Sleep data sources.

A source turns what another integration provides into ``Night`` objects.
To support another source: write a class with the ``SleepSource`` shape and
add it to ``SOURCES``. Nothing else in the integration knows where nights
come from.
"""

from __future__ import annotations

from datetime import datetime
from typing import Protocol

from homeassistant.core import HomeAssistant, State

from ..const import SOURCE_LIFE_DASHBOARD
from ..night import HeartRate, Night
from .life_dashboard import LifeDashboardSource


class SleepSource(Protocol):
    """What the integration needs from a source."""

    key: str

    def matches(self, state: State) -> bool:
        """Return True if this entity looks like the source's sleep entity."""

    def night_from_state(self, state: State) -> Night | None:
        """Return the newest main night carried by the entity, if any."""

    async def async_past_nights(self, hass: HomeAssistant, entity_id: str) -> list[Night]:
        """Return earlier nights for seeding history (may be empty)."""

    async def async_heart_rate(
        self, hass: HomeAssistant, entity_id: str, start: datetime, end: datetime
    ) -> HeartRate | None:
        """Return the heart rate between falling asleep and waking, if known."""


SOURCES: dict[str, SleepSource] = {SOURCE_LIFE_DASHBOARD: LifeDashboardSource()}


def detect_source(state: State) -> str | None:
    """Return the key of the source that understands this entity."""
    for key, source in SOURCES.items():
        if source.matches(state):
            return key
    return None
