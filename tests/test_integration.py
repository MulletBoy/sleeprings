"""Integration tests with a fake Life Dashboard sleep entity (synthetic nights)."""

import json
from datetime import UTC, date, datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from homeassistant.config_entries import SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType, InvalidData
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant.common import MockConfigEntry

from custom_components.sleep_rings.const import (
    CONF_FORMULA,
    CONF_SLEEP_ENTITY,
    CONF_SOURCE,
    CONF_TIME_ZONE_ATTRIBUTE,
    CONF_TIME_ZONE_ENTITY,
    DOMAIN,
    SOURCE_LIFE_DASHBOARD,
)
from custom_components.sleep_rings.diagnostics import async_get_config_entry_diagnostics
from custom_components.sleep_rings.formula import LIMITS
from custom_components.sleep_rings.night import Night
from custom_components.sleep_rings.sources.life_dashboard import LifeDashboardSource

MANIFEST = Path(__file__).parent.parent / "custom_components/sleep_rings/manifest.json"
SOURCE_ENTITY = "sensor.phone_last_sleep_asleep"
ZONE_ENTITY = "sensor.phone_geocoded_location"
SCORE = "sensor.sleep_sleep_score"
FIRST_WAKE = date(2030, 3, 2)


@pytest.fixture(autouse=True)
async def _setup(hass: HomeAssistant, hass_storage) -> None:
    """Sydney is UTC+11 in March: 12:00 UTC is 23:00 local."""
    await hass.config.async_set_time_zone("Australia/Sydney")


def night_attributes(
    wake: date,
    *,
    onset_utc_hour: float = 12.0,
    stages: tuple[tuple[str, float], ...] = (("light", 300), ("awake", 6), ("rem", 145)),
) -> tuple[str, dict]:
    """Return state and attributes shaped like Life Dashboard's sleep sensor."""
    start = datetime(wake.year, wake.month, wake.day, tzinfo=UTC) - timedelta(days=1)
    start += timedelta(hours=onset_utc_hour)
    at = start
    timeline = []
    for stage, minutes in stages:
        end = at + timedelta(minutes=minutes)
        timeline.append({"stage": stage, "start": at.isoformat(), "end": end.isoformat()})
        at = end
    asleep = sum(m for s, m in stages if s in ("light", "deep", "rem", "sleeping"))
    awake = sum(m for s, m in stages if s in ("awake", "out_of_bed"))
    return str(round(asleep / 60, 4)), {
        "night": wake.isoformat(),
        "start": start.isoformat(),
        "end": at.isoformat(),
        "asleep_minutes": asleep,
        "awake_minutes": awake,
        "stages": timeline,
    }


async def push_night(hass: HomeAssistant, wake: date, **kwargs) -> None:
    state, attributes = night_attributes(wake, **kwargs)
    hass.states.async_set(SOURCE_ENTITY, state, attributes)
    await hass.async_block_till_done()


async def setup_entry(hass: HomeAssistant, options: dict | None = None) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Sleep",
        unique_id=SOURCE_ENTITY,
        data={CONF_SOURCE: SOURCE_LIFE_DASHBOARD, CONF_SLEEP_ENTITY: SOURCE_ENTITY},
        options=options or {},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_config_flow(hass: HomeAssistant) -> None:
    await push_night(hass, FIRST_WAKE)
    hass.states.async_set("sensor.something_else", "1")

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Sleep", CONF_SLEEP_ENTITY: "sensor.something_else"}
    )
    assert result["errors"] == {CONF_SLEEP_ENTITY: "not_a_sleep_entity"}

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Sleep", CONF_SLEEP_ENTITY: SOURCE_ENTITY, CONF_TIME_ZONE_ENTITY: ZONE_ENTITY},
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"] == {CONF_SOURCE: SOURCE_LIFE_DASHBOARD, CONF_SLEEP_ENTITY: SOURCE_ENTITY}
    assert result["options"] == {
        CONF_TIME_ZONE_ENTITY: ZONE_ENTITY,
        CONF_TIME_ZONE_ATTRIBUTE: "Time Zone",
    }

    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Again", CONF_SLEEP_ENTITY: SOURCE_ENTITY}
    )
    assert result["type"] is FlowResultType.ABORT


async def test_first_night(hass: HomeAssistant) -> None:
    await push_night(hass, FIRST_WAKE)
    await setup_entry(hass)

    state = hass.states.get(SCORE)
    # 7h 25m asleep, no bedtime history, one 6-minute wake-up.
    assert state.state == "98"
    a = state.attributes
    assert a["night"] == "2030-03-02"
    assert a["band"] == "very_high"
    assert (a["duration_points"], a["bedtime_points"], a["interruptions_points"]) == (47.6, 30, 20)
    assert (a["asleep_minutes"], a["wakeups"], a["awake_minutes"]) == (445, 1, 6)
    assert a["bedtime_deviation_minutes"] is None
    assert a["model_version"] == "v5"
    assert (a["onset_minutes"], a["usual_onset_minutes"]) == (660, None)
    assert a["duration_goal_hours"] == 8.3
    assert a["heart_rate_average"] is None
    assert [s["stage"] for s in a["stages"]] == ["core", "awake", "rem"]
    assert a["history"] == [{"night": "2030-03-02", "score": 98, "d": 48, "b": 30, "i": 20}]
    assert hass.states.get("sensor.sleep_sleep_score_band").state == "very_high"
    assert hass.states.get("sensor.sleep_duration_points").state == "47.6"
    assert hass.states.get("sensor.sleep_wake_ups").state == "1"


async def test_bedtime_against_previous_13_nights(hass: HomeAssistant) -> None:
    await setup_entry(hass)
    assert hass.states.get(SCORE).state == "unknown"

    for day in range(14):
        await push_night(hass, FIRST_WAKE + timedelta(days=day))
    # 46 minutes later than the usual 23:00: the public data point, 23.5 of 30.
    await push_night(hass, FIRST_WAKE + timedelta(days=14), onset_utc_hour=12 + 46 / 60)

    a = hass.states.get(SCORE).attributes
    assert a["bedtime_deviation_minutes"] == 46
    assert a["bedtime_points"] == 23.5
    assert (a["onset_minutes"], a["usual_onset_minutes"]) == (706, 660)
    assert len(a["onsets"]) == 13
    assert {o["minutes"] for o in a["onsets"]} == {660}
    assert len(a["history"]) == 15


async def test_resent_night_replaces_itself(hass: HomeAssistant) -> None:
    await setup_entry(hass)
    await push_night(hass, FIRST_WAKE)
    await push_night(hass, FIRST_WAKE, stages=(("light", 200), ("awake", 30), ("deep", 100)))

    a = hass.states.get(SCORE).attributes
    assert len(a["history"]) == 1
    assert (a["asleep_minutes"], a["awake_minutes"]) == (300, 30)


async def test_onset_uses_the_phones_time_zone(hass: HomeAssistant) -> None:
    hass.states.async_set(ZONE_ENTITY, "Somewhere", {"Time Zone": "Asia/Bangkok"})
    entry = await setup_entry(hass, {CONF_TIME_ZONE_ENTITY: ZONE_ENTITY})
    manager = entry.runtime_data

    # 12:00 UTC is 19:00 in Bangkok: 420 minutes after noon (660 in Sydney).
    await push_night(hass, FIRST_WAKE)
    assert manager.records["2030-03-02"].onset_minutes == 420
    assert hass.states.get(SCORE).attributes["time_zone"] == "Asia/Bangkok"

    # Right after a restart the attribute reads None: keep the last known zone.
    hass.states.async_set(ZONE_ENTITY, "Somewhere", {"Time Zone": None})
    await push_night(hass, FIRST_WAKE + timedelta(days=1))
    assert manager.records["2030-03-03"].time_zone == "Asia/Bangkok"

    # Back home; a night already stored keeps the zone it arrived with.
    hass.states.async_set(ZONE_ENTITY, "Home", {"Time Zone": "Australia/Sydney"})
    await push_night(hass, FIRST_WAKE + timedelta(days=1), stages=(("light", 400),))
    await push_night(hass, FIRST_WAKE + timedelta(days=2))
    assert manager.records["2030-03-03"].time_zone == "Asia/Bangkok"
    assert manager.records["2030-03-04"].onset_minutes == 660


async def test_nights_survive_a_reload_and_options_rescore(hass: HomeAssistant) -> None:
    entry = await setup_entry(hass)
    for day in range(3):
        await push_night(hass, FIRST_WAKE + timedelta(days=day))
    assert hass.states.get(SCORE).attributes["duration_points"] == 47.6

    hass.config_entries.async_update_entry(
        entry, options={CONF_FORMULA: {"duration_full_hours": 7.0}}
    )
    await hass.async_block_till_done()

    a = hass.states.get(SCORE).attributes
    assert len(a["history"]) == 3
    assert a["duration_points"] == 50
    assert a["constants"]["duration_full_hours"] == 7.0
    assert a["constants"]["bedtime_history_nights"] == 13


async def test_options_flow_keeps_only_changed_constants(hass: HomeAssistant) -> None:
    entry = await setup_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    defaults = entry.runtime_data.constants.as_dict()
    formula = {k: v for k, v in defaults.items() if k in LIMITS}
    formula["wakeups_free"] = 2

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {CONF_TIME_ZONE_ATTRIBUTE: "Time Zone", CONF_FORMULA: formula}
    )
    await hass.async_block_till_done()
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options == {
        CONF_TIME_ZONE_ATTRIBUTE: "Time Zone",
        CONF_FORMULA: {"wakeups_free": 2},
    }
    assert entry.runtime_data.constants.wakeups_free == 2


async def test_history_is_seeded_from_the_source(hass: HomeAssistant) -> None:
    start = datetime(2030, 2, 20, 12, 0, tzinfo=UTC)
    past = [
        Night(
            wake_date=(start + timedelta(days=n + 1)).date(),
            start=start + timedelta(days=n),
            end=start + timedelta(days=n, hours=8),
            asleep_minutes=450,
            awake_minutes=12,
        )
        for n in range(5)
    ]
    with patch.object(LifeDashboardSource, "async_past_nights", return_value=past):
        entry = await setup_entry(hass)

    manager = entry.runtime_data
    assert len(manager.records) == 5
    assert all(r.seeded and not r.has_stages for r in manager.records.values())
    history = hass.states.get(SCORE).attributes["history"]
    assert history[0] == {
        "night": "2030-02-21",
        "score": 98,
        "d": 48,
        "b": 30,
        "i": 20,
        "estimated": True,
    }

    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    assert diagnostics["nights_seeded"] == 5
    assert diagnostics["model_version"] == "v5"


async def test_life_dashboard_ledger_is_read_defensively(hass: HomeAssistant) -> None:
    source = LifeDashboardSource()
    assert await source.async_past_nights(hass, SOURCE_ENTITY) == []

    ld_entry = MockConfigEntry(domain="life_dashboard")
    ld_entry.add_to_hass(hass)
    er.async_get(hass).async_get_or_create(
        "sensor",
        "life_dashboard",
        "x_last_sleep_asleep",
        suggested_object_id="phone_last_sleep_asleep",
        config_entry=ld_entry,
    )
    t0 = datetime(2030, 3, 1, 12, 0, tzinfo=UTC).timestamp()
    ld_entry.runtime_data = SimpleNamespace(
        history=SimpleNamespace(
            ledger=SimpleNamespace(
                sleep={
                    "nights": {
                        "main": {
                            "day": "2030-03-02",
                            "start": t0,
                            "end": t0 + 28800,
                            "asleep": 440.0,
                            "awake": 10.0,
                        },
                        "nap": {
                            "day": "2030-03-02",
                            "start": t0 + 40000,
                            "end": t0 + 42400,
                            "asleep": 35.0,
                        },
                    },
                    "stages": {
                        "main": [
                            ["in_bed", t0, t0 + 28800],
                            ["light", t0 + 600, t0 + 28800],
                            ["deep", t0 + 3600, t0 + 7200, "uuid"],
                            ["awake", t0 + 10000, t0 + 10300],
                        ]
                    },
                }
            )
        )
    )
    nights = await source.async_past_nights(hass, SOURCE_ENTITY)
    assert len(nights) == 1
    assert nights[0].asleep_minutes == 440
    assert [s.stage for s in nights[0].stages] == ["core", "deep", "core"]

    ld_entry.runtime_data = SimpleNamespace(history=None)
    assert await source.async_past_nights(hass, SOURCE_ENTITY) == []


async def test_card_is_served_and_loaded(hass: HomeAssistant, hass_client) -> None:
    with patch("custom_components.sleep_rings.frontend.add_extra_js_url") as add_url:
        await setup_entry(hass)
    url = add_url.call_args.args[1]
    version = json.loads(MANIFEST.read_text())["version"]
    assert url.startswith(f"/sleep_rings/sleep-rings-card.js?v={version}-")
    assert len(url.rsplit("-", 1)[1]) == 8

    client = await hass_client()
    response = await client.get("/sleep_rings/sleep-rings-card.js")
    assert response.status == 200
    assert "sleep-rings-card" in await response.text()


async def test_bad_source_data_is_ignored(hass: HomeAssistant) -> None:
    entry = await setup_entry(hass)
    await push_night(hass, FIRST_WAKE)
    manager = entry.runtime_data

    state, attributes = night_attributes(FIRST_WAKE + timedelta(days=1))
    for bad in (
        {"asleep_minutes": float("nan")},
        {"asleep_minutes": float("inf")},
        {"asleep_minutes": 99999},
        {"night": "2099-01-01"},
        {"end": "2030-03-20T00:00:00+00:00"},
        {"start": "not a time"},
    ):
        hass.states.async_set(SOURCE_ENTITY, state, {**attributes, **bad})
        await hass.async_block_till_done()
        assert list(manager.records) == ["2030-03-02"], bad

    # The entry keeps working afterwards.
    await push_night(hass, FIRST_WAKE + timedelta(days=1))
    assert list(manager.records) == ["2030-03-02", "2030-03-03"]
    assert hass.states.get(SCORE).state == "98"


async def test_options_flow_rejects_values_that_would_break_the_formula(
    hass: HomeAssistant,
) -> None:
    entry = await setup_entry(hass)
    defaults = {k: v for k, v in entry.runtime_data.constants.as_dict().items() if k in LIMITS}
    for bad in (
        {"duration_power": -1},
        {"wakeup_points": -5},
        {"bedtime_history_nights": 0},
        {"duration_coeff": float("nan")},
        {"band_ok": 90},
    ):
        flow = await hass.config_entries.options.async_init(entry.entry_id)
        # Either the form's own limits refuse the value, or the flow's check does.
        try:
            result = await hass.config_entries.options.async_configure(
                flow["flow_id"],
                {CONF_TIME_ZONE_ATTRIBUTE: "Time Zone", CONF_FORMULA: {**defaults, **bad}},
            )
        except InvalidData:
            pass
        else:
            assert result["type"] is FlowResultType.FORM, bad
            assert result["errors"] == {"base": "invalid_formula"}, bad
        hass.config_entries.options.async_abort(flow["flow_id"])
    assert CONF_FORMULA not in entry.options


async def test_diagnostics_hold_nothing_personal(hass: HomeAssistant) -> None:
    hass.states.async_set(ZONE_ENTITY, "Somewhere", {"Time Zone": "Asia/Bangkok"})
    entry = await setup_entry(hass, {CONF_TIME_ZONE_ENTITY: ZONE_ENTITY})
    await push_night(hass, FIRST_WAKE)

    text = json.dumps(await async_get_config_entry_diagnostics(hass, entry))
    for private in (SOURCE_ENTITY, ZONE_ENTITY, "Bangkok", "2030-03", "T12:00", "onset"):
        assert private not in text, private
    assert '"score": 98' in text


async def test_removing_the_entry_removes_its_stored_nights(
    hass: HomeAssistant, hass_storage
) -> None:
    entry = await setup_entry(hass)
    await push_night(hass, FIRST_WAKE)
    await entry.runtime_data.async_unload()
    key = f"{DOMAIN}.{entry.entry_id}"
    assert key in hass_storage

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert key not in hass_storage
