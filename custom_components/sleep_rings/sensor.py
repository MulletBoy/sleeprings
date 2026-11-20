"""Sensors: the score, its three parts, the band and the measurements."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import EntityCategory, UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .formula import BANDS, MODEL_VERSION
from .manager import NightRecord, SleepRingsConfigEntry, SleepRingsManager


@dataclass(frozen=True, kw_only=True)
class SleepRingsSensorDescription(SensorEntityDescription):
    """Describes a SleepRings sensor."""

    value_fn: Callable[[NightRecord], Any]


SENSORS: tuple[SleepRingsSensorDescription, ...] = (
    SleepRingsSensorDescription(
        key="sleep_score",
        translation_key="sleep_score",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: r.score,
    ),
    SleepRingsSensorDescription(
        key="duration_points",
        translation_key="duration_points",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: round(r.duration, 1),
    ),
    SleepRingsSensorDescription(
        key="bedtime_points",
        translation_key="bedtime_points",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: round(r.bedtime, 1),
    ),
    SleepRingsSensorDescription(
        key="interruptions_points",
        translation_key="interruptions_points",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: round(r.interruptions, 1),
    ),
    SleepRingsSensorDescription(
        key="band",
        translation_key="band",
        device_class=SensorDeviceClass.ENUM,
        options=list(BANDS),
        value_fn=lambda r: r.band,
    ),
    SleepRingsSensorDescription(
        key="time_asleep",
        translation_key="time_asleep",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=2,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda r: round(r.hours_asleep, 3),
    ),
    SleepRingsSensorDescription(
        key="bedtime_deviation",
        translation_key="bedtime_deviation",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda r: None if r.deviation is None else round(r.deviation, 1),
    ),
    SleepRingsSensorDescription(
        key="wakeups",
        translation_key="wakeups",
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda r: r.wakeups,
    ),
    SleepRingsSensorDescription(
        key="time_awake",
        translation_key="time_awake",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.MINUTES,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=lambda r: round(r.minutes_awake, 1),
    ),
    SleepRingsSensorDescription(
        key="sleeping_heart_rate",
        translation_key="sleeping_heart_rate",
        native_unit_of_measurement="bpm",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: r.heart_rate_average,
    ),
    SleepRingsSensorDescription(
        key="sleeping_heart_rate_lowest",
        translation_key="sleeping_heart_rate_lowest",
        native_unit_of_measurement="bpm",
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=0,
        value_fn=lambda r: r.heart_rate_lowest,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SleepRingsConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Add the sensors of one config entry."""
    manager = entry.runtime_data
    async_add_entities(SleepRingsSensor(manager, description) for description in SENSORS)


class SleepRingsSensor(SensorEntity):
    """A value of the newest night."""

    entity_description: SleepRingsSensorDescription
    _attr_has_entity_name = True
    _attr_should_poll = False
    # Long lists: useful to the card, pointless in the recorder.
    _unrecorded_attributes = frozenset(
        {"stages", "history", "onsets", "constants", "heart_rate_hours"}
    )

    def __init__(
        self, manager: SleepRingsManager, description: SleepRingsSensorDescription
    ) -> None:
        """Initialise the sensor."""
        self.entity_description = description
        self._manager = manager
        entry = manager.entry
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer="SleepRings",
            model=f"Sleep score model {MODEL_VERSION}",
            entry_type=DeviceEntryType.SERVICE,
        )

    async def async_added_to_hass(self) -> None:
        """Follow the manager."""
        self.async_on_remove(self._manager.async_add_listener(self._handle_update))

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> Any:
        """Return the value for the newest night."""
        record = self._manager.latest
        return None if record is None else self.entity_description.value_fn(record)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return the night's details (score sensor) or just its date."""
        record = self._manager.latest
        if record is None:
            return None
        if self.entity_description.key != "sleep_score":
            return {"night": record.night}
        manager = self._manager
        return {
            "night": record.night,
            "band": record.band,
            "duration_points": round(record.duration, 1),
            "bedtime_points": round(record.bedtime, 1),
            "interruptions_points": round(record.interruptions, 1),
            "asleep_minutes": round(record.hours_asleep * 60, 1),
            "bedtime_deviation_minutes": (
                None if record.deviation is None else round(record.deviation, 1)
            ),
            "wakeups": record.wakeups,
            "awake_minutes": round(record.minutes_awake, 1),
            "sleep_start": record.sleep_start,
            "sleep_end": record.sleep_end,
            "time_zone": record.time_zone,
            "onset_minutes": record.onset_minutes,
            "usual_onset_minutes": (
                None
                if record.deviation is None
                else round(record.onset_minutes - record.deviation, 1)
            ),
            "duration_goal_hours": manager.constants.duration_full_hours,
            "heart_rate_average": record.heart_rate_average,
            "heart_rate_lowest": record.heart_rate_lowest,
            "heart_rate_hours": (
                manager.heart_rate_hours if manager.heart_rate_night == record.night else []
            ),
            "has_stages": record.has_stages,
            "model_version": MODEL_VERSION,
            "stages": manager.stages if manager.stages_night == record.night else [],
            "onsets": manager.previous_onsets(record.night),
            "history": manager.history,
            "constants": manager.constants.as_dict(),
        }
