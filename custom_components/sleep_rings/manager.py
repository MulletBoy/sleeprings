"""Keeps the night history of one person and scores each new night."""

from __future__ import annotations

import logging
from collections.abc import Callable
from dataclasses import asdict, dataclass
from datetime import date, datetime, timedelta
from math import isfinite
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import CALLBACK_TYPE, Event, HomeAssistant, State, callback
from homeassistant.helpers.event import (
    EventStateChangedData,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    CONF_FORMULA,
    CONF_SLEEP_ENTITY,
    CONF_SOURCE,
    CONF_TIME_ZONE_ATTRIBUTE,
    CONF_TIME_ZONE_ENTITY,
    DEFAULT_TIME_ZONE_ATTRIBUTE,
    DOMAIN,
    HISTORY_NIGHTS,
    SEED_NIGHTS,
    STORAGE_VERSION,
    STORED_NIGHTS,
)
from .formula import MODEL_VERSION, Constants, bedtime_deviation, score_night
from .night import Night, measure, sanitize_night, sleep_window
from .sources import SOURCES

_LOGGER = logging.getLogger(__name__)

SAVE_DELAY = 10
HEART_RATE_INTERVAL = timedelta(minutes=30)

type SleepRingsConfigEntry = ConfigEntry[SleepRingsManager]


@dataclass(slots=True)
class NightRecord:
    """One scored night, as kept on disk.

    The measurements are stored next to the score so that every night can be
    rescored when the constants change.
    """

    night: str  # wake date, YYYY-MM-DD
    onset_minutes: int  # minutes after noon, in the night's local time
    time_zone: str
    hours_asleep: float
    wakeups: int
    minutes_awake: float
    has_stages: bool
    sleep_start: str
    sleep_end: str
    seeded: bool = False
    score: int | None = None
    duration: float = 0.0
    bedtime: float = 0.0
    interruptions: float = 0.0
    band: str | None = None
    deviation: float | None = None
    heart_rate_average: float | None = None
    heart_rate_lowest: float | None = None

    def measurements(self) -> tuple[Any, ...]:
        """Return what identifies the night's input data."""
        return (
            self.onset_minutes,
            round(self.hours_asleep, 4),
            self.wakeups,
            round(self.minutes_awake, 2),
            self.sleep_start,
            self.sleep_end,
        )


def _stage_dicts(night: Night) -> list[dict[str, str]]:
    """Return a night's stages as plain dicts (for storage and the card)."""
    return [
        {"stage": s.stage, "start": s.start.isoformat(), "end": s.end.isoformat()}
        for s in night.stages
    ]


def _record_is_sound(record: NightRecord) -> bool:
    """Check a stored night before trusting it (the file may be damaged or edited)."""
    try:
        date.fromisoformat(record.night)
        numbers = (record.onset_minutes, record.hours_asleep, record.wakeups, record.minutes_awake)
        return (
            all(isinstance(n, (int, float)) and isfinite(n) for n in numbers)
            and 0 <= record.hours_asleep <= 36
            and isinstance(record.sleep_start, str)
            and isinstance(record.sleep_end, str)
            and isinstance(record.time_zone, str)
        )
    except TypeError, ValueError:
        return False


class SleepRingsManager:
    """Listens to the source entity, stores nights and scores them."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Set up from a config entry."""
        self.hass = hass
        self.entry = entry
        self.sleep_entity: str = entry.data[CONF_SLEEP_ENTITY]
        self.source = SOURCES[entry.data[CONF_SOURCE]]
        self.constants = Constants.from_dict(entry.options.get(CONF_FORMULA))
        self.records: dict[str, NightRecord] = {}
        # Stage timeline of every stored night that has one, by wake date.
        self.stages_by_night: dict[str, list[dict[str, str]]] = {}
        self.last_time_zone: str | None = None
        self.heart_rate_hours: list[dict[str, Any]] = []
        self.heart_rate_night: str | None = None
        self._unsub_timer: CALLBACK_TYPE | None = None
        # private: the file holds health data, so only Home Assistant's user may read it.
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}", private=True
        )
        self._stopped = False
        self._listeners: list[Callable[[], None]] = []
        self._unsub: CALLBACK_TYPE | None = None

    # ----- lifecycle -----

    async def async_setup(self) -> None:
        """Load stored nights (or seed them), then follow the source entity."""
        stored = await self._store.async_load()
        if stored:
            self._restore(stored)
            await self._async_backfill_stages()
        else:
            await self._async_seed()
        self._rescore()

        if (state := self.hass.states.get(self.sleep_entity)) is not None:
            await self._async_process(state)
        self._unsub = async_track_state_change_event(
            self.hass, [self.sleep_entity], self._handle_state_change
        )
        # Heart rate can arrive after the night itself, so look again now and then.
        await self._async_heart_rate()
        self._unsub_timer = async_track_time_interval(
            self.hass, self._handle_timer, HEART_RATE_INTERVAL
        )

    async def async_unload(self) -> None:
        """Stop listening and write anything pending."""
        if self._unsub:
            self._unsub()
            self._unsub = None
        if self._unsub_timer:
            self._unsub_timer()
            self._unsub_timer = None
        self._stopped = True
        await self._store.async_save(self._data_to_save())

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> CALLBACK_TYPE:
        """Call ``listener`` whenever the nights change."""
        self._listeners.append(listener)

        @callback
        def remove() -> None:
            self._listeners.remove(listener)

        return remove

    # ----- what the entities read -----

    @property
    def latest(self) -> NightRecord | None:
        """Return the newest night."""
        return self.records[max(self.records)] if self.records else None

    @property
    def history(self) -> list[dict[str, Any]]:
        """Return the scores of the last nights, oldest first."""
        nights = sorted(self.records)[-HISTORY_NIGHTS:]
        return [
            {
                "night": record.night,
                "score": record.score,
                "d": round(record.duration),
                "b": round(record.bedtime),
                "i": round(record.interruptions),
                **({} if record.has_stages else {"estimated": True}),
            }
            for record in (self.records[night] for night in nights)
            if record.score is not None
        ]

    @property
    def stages(self) -> list[dict[str, str]]:
        """Return the newest night's stage timeline."""
        latest = self.latest
        return self.stages_by_night.get(latest.night, []) if latest else []

    def night_attributes(self, record: NightRecord) -> dict[str, Any]:
        """Return one night as the card reads it (also the score sensor's attributes)."""
        newest = record is self.latest
        return {
            "night": record.night,
            "score": record.score,
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
            "duration_goal_hours": self.constants.duration_full_hours,
            "heart_rate_average": record.heart_rate_average,
            "heart_rate_lowest": record.heart_rate_lowest,
            "heart_rate_hours": (
                self.heart_rate_hours if newest and self.heart_rate_night == record.night else []
            ),
            "has_stages": record.has_stages,
            "model_version": MODEL_VERSION,
            "stages": self.stages_by_night.get(record.night, []),
        }

    async def async_night_details(self, night: str) -> dict[str, Any] | None:
        """Return any stored night for the card, with its heart rate looked up."""
        record = self.records.get(night)
        if record is None:
            return None
        details = self.night_attributes(record)
        if details["heart_rate_hours"]:
            return details
        start = dt_util.parse_datetime(record.sleep_start)
        end = dt_util.parse_datetime(record.sleep_end)
        if start is None or end is None:
            return details
        try:
            heart = await self.source.async_heart_rate(self.hass, self.sleep_entity, start, end)
        except Exception:  # noqa: BLE001 - the night is still worth showing without it
            _LOGGER.debug("Could not read the heart rate of %s", night, exc_info=True)
            heart = None
        if heart is not None:
            details["heart_rate_average"] = round(heart.average, 1)
            details["heart_rate_lowest"] = round(heart.lowest, 1)
            details["heart_rate_hours"] = [dict(hour) for hour in heart.hours]
        return details

    def previous_onsets(self, night: str) -> list[dict[str, Any]]:
        """Return the onsets a night is compared with, oldest first."""
        earlier = [n for n in sorted(self.records) if n < night]
        return [
            {"night": n, "minutes": self.records[n].onset_minutes}
            for n in earlier[-self.constants.bedtime_history_nights :]
        ]

    # ----- processing -----

    @callback
    def _handle_state_change(self, event: Event[EventStateChangedData]) -> None:
        if (state := event.data["new_state"]) is not None:
            self.entry.async_create_task(self.hass, self._async_process(state))

    async def _async_process(self, state: State) -> None:
        """Take the night carried by the source entity; never let bad data break the entry."""
        try:
            await self._async_take(state)
        except Exception:  # noqa: BLE001 - whatever the source sent, keep running
            _LOGGER.warning("Ignored a night from %s that could not be read", self.sleep_entity)
            _LOGGER.debug("Details", exc_info=True)

    async def _async_take(self, state: State) -> None:
        """Store and score the entity's night if it is new or changed."""
        if state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
            return
        night = self.source.night_from_state(state)
        night = sanitize_night(night) if night is not None else None
        if night is None:
            return
        key = night.wake_date.isoformat()
        existing = self.records.get(key)

        # A night keeps the zone it first arrived with: the phone may have
        # travelled since. Seeded nights never had a zone of their own.
        if existing and not existing.seeded:
            zone_name = existing.time_zone
        else:
            zone_name = await self._async_time_zone_name()
        record = await self._async_record(night, zone_name, seeded=False)
        stages = _stage_dicts(night)

        stages_changed = bool(stages) and self.stages_by_night.get(key) != stages
        record_changed = (
            existing is None or existing.seeded or existing.measurements() != record.measurements()
        )
        if self._stopped or not (stages_changed or record_changed):
            return
        if stages_changed:
            self.stages_by_night[key] = stages
        if record_changed:
            self.records[key] = record
            for old in sorted(self.records)[:-STORED_NIGHTS]:
                del self.records[old]
                self.stages_by_night.pop(old, None)
            self._rescore()
        await self._async_heart_rate()
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)
        for listener in list(self._listeners):
            listener()

    async def _handle_timer(self, _now: datetime) -> None:
        if await self._async_heart_rate():
            self._store.async_delay_save(self._data_to_save, SAVE_DELAY)
            for listener in list(self._listeners):
                listener()

    async def _async_heart_rate(self) -> bool:
        """Fetch the newest night's sleeping heart rate; True if it changed."""
        record = self.latest
        if record is None:
            return False
        start = dt_util.parse_datetime(record.sleep_start)
        end = dt_util.parse_datetime(record.sleep_end)
        if start is None or end is None:
            return False
        try:
            result = await self.source.async_heart_rate(self.hass, self.sleep_entity, start, end)
        except Exception:  # noqa: BLE001 - a source problem must not stop the score
            _LOGGER.debug("Could not read the sleeping heart rate", exc_info=True)
            return False
        if result is None:
            return False
        hours = [dict(hour) for hour in result.hours]
        average, lowest = round(result.average, 1), round(result.lowest, 1)
        if (
            record.heart_rate_average == average
            and record.heart_rate_lowest == lowest
            and self.heart_rate_night == record.night
            and self.heart_rate_hours == hours
        ):
            return False
        record.heart_rate_average, record.heart_rate_lowest = average, lowest
        self.heart_rate_hours, self.heart_rate_night = hours, record.night
        return True

    async def _async_record(self, night: Night, zone_name: str, *, seeded: bool) -> NightRecord:
        zone = await dt_util.async_get_time_zone(zone_name) or dt_util.DEFAULT_TIME_ZONE
        m = measure(night, zone, self.constants)
        _, final_wake = sleep_window(night)
        return NightRecord(
            night=night.wake_date.isoformat(),
            onset_minutes=m.onset_minutes,
            time_zone=zone_name,
            hours_asleep=m.hours_asleep,
            wakeups=m.wakeups,
            minutes_awake=m.minutes_awake,
            has_stages=m.has_stages,
            sleep_start=m.onset.isoformat(),
            sleep_end=final_wake.isoformat(),
            seeded=seeded,
        )

    async def _async_time_zone_name(self) -> str:
        """Return the zone the person is in now.

        Order: the configured entity (attribute first, then its state), the
        last zone that entity gave us, Home Assistant's own zone. The iOS
        app's attribute reads None for a while after a restart, hence the
        remembered value.
        """
        entity_id = self.entry.options.get(CONF_TIME_ZONE_ENTITY)
        if entity_id and (state := self.hass.states.get(entity_id)) is not None:
            attribute = self.entry.options.get(
                CONF_TIME_ZONE_ATTRIBUTE, DEFAULT_TIME_ZONE_ATTRIBUTE
            )
            for candidate in (state.attributes.get(attribute), state.state):
                if not isinstance(candidate, str) or "/" not in candidate:
                    continue
                if await dt_util.async_get_time_zone(candidate) is not None:
                    self.last_time_zone = candidate
                    return candidate
        return self.last_time_zone or self.hass.config.time_zone

    async def _async_seed(self) -> None:
        """Fill the history from the source's past nights (first setup only)."""
        nights = await self.source.async_past_nights(self.hass, self.sleep_entity)
        zone_name = self.hass.config.time_zone
        for raw in nights[-SEED_NIGHTS:]:
            night = sanitize_night(raw)
            if night is None:
                continue
            record = await self._async_record(night, zone_name, seeded=True)
            self.records[record.night] = record
            if night.stages:
                self.stages_by_night[record.night] = _stage_dicts(night)
        if nights:
            _LOGGER.debug("Seeded %s past nights from %s", len(self.records), self.source.key)

    async def _async_backfill_stages(self) -> None:
        """Fetch stage timelines the source still has for nights stored without one.

        Versions before 1.1 kept the timeline of the newest night only.
        """
        missing = {
            r.night for r in self.records.values() if r.has_stages
        } - self.stages_by_night.keys()
        if not missing:
            return
        for raw in await self.source.async_past_nights(self.hass, self.sleep_entity):
            night = sanitize_night(raw)
            if night is not None and night.stages and night.wake_date.isoformat() in missing:
                self.stages_by_night[night.wake_date.isoformat()] = _stage_dicts(night)

    def _rescore(self) -> None:
        """Score every night against the onsets of the nights before it."""
        onsets: list[int] = []
        for key in sorted(self.records):
            record = self.records[key]
            deviation = bedtime_deviation(record.onset_minutes, onsets, self.constants)
            result = score_night(
                record.hours_asleep,
                deviation,
                record.wakeups,
                record.minutes_awake,
                self.constants,
            )
            record.score = result.score
            record.duration = result.duration
            record.bedtime = result.bedtime
            record.interruptions = result.interruptions
            record.band = result.band
            record.deviation = deviation
            onsets.append(record.onset_minutes)

    async def async_recalculate(self) -> None:
        """Rescore all stored nights and tell the entities."""
        self._rescore()
        self._store.async_delay_save(self._data_to_save, SAVE_DELAY)
        for listener in list(self._listeners):
            listener()

    # ----- storage -----

    def _restore(self, stored: dict[str, Any]) -> None:
        fields = NightRecord.__dataclass_fields__
        for item in stored.get("nights", []):
            try:
                record = NightRecord(**{k: v for k, v in item.items() if k in fields})
            except TypeError:
                continue
            if _record_is_sound(record):
                self.records[record.night] = record
        stages = stored.get("stages_by_night")
        self.stages_by_night = dict(stages) if isinstance(stages, dict) else {}
        # Before 1.1 only the newest night's stages were kept.
        if stored.get("stages") and stored.get("stages_night"):
            self.stages_by_night.setdefault(stored["stages_night"], stored["stages"])
        self.last_time_zone = stored.get("last_time_zone")
        self.heart_rate_hours = stored.get("heart_rate_hours") or []
        self.heart_rate_night = stored.get("heart_rate_night")

    def _data_to_save(self) -> dict[str, Any]:
        return {
            "model_version": MODEL_VERSION,
            "nights": [asdict(self.records[key]) for key in sorted(self.records)],
            "stages_by_night": self.stages_by_night,
            "last_time_zone": self.last_time_zone,
            "heart_rate_hours": self.heart_rate_hours,
            "heart_rate_night": self.heart_rate_night,
        }
