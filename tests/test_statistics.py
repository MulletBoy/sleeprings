"""Long-term statistics test (needs the recorder, which must start before hass)."""

from datetime import UTC, datetime, timedelta

from homeassistant.components.recorder import get_instance
from homeassistant.components.recorder.models import (
    StatisticData,
    StatisticMeanType,
    StatisticMetaData,
)
from homeassistant.components.recorder.statistics import (
    async_add_external_statistics,
    statistics_during_period,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant.common import MockConfigEntry
from pytest_homeassistant.components.recorder.common import async_wait_recording_done

from custom_components.sleep_rings.statistics import statistic_id

from .test_integration import FIRST_WAKE, push_night, setup_entry


async def test_statistics_are_dated_by_wake_date(
    recorder_mock, hass: HomeAssistant, hass_storage
) -> None:
    await hass.config.async_set_time_zone("Australia/Sydney")
    entry = await setup_entry(hass)
    await push_night(hass, FIRST_WAKE)
    await push_night(hass, FIRST_WAKE + timedelta(days=1), stages=(("light", 360),))
    await async_wait_recording_done(hass)

    score_id = statistic_id(entry.entry_id, "score")
    stats = await get_instance(hass).async_add_executor_job(
        statistics_during_period,
        hass,
        datetime(2030, 3, 1, tzinfo=UTC),
        None,
        {score_id},
        "hour",
        None,
        {"mean"},
    )
    rows = stats[score_id]
    # Noon in Sydney (UTC+11) is 01:00 UTC on the wake date.
    assert [datetime.fromtimestamp(r["start"], UTC).isoformat() for r in rows] == [
        "2030-03-02T01:00:00+00:00",
        "2030-03-03T01:00:00+00:00",
    ]
    assert [r["mean"] for r in rows] == [98, 84]


async def test_sleeping_heart_rate_from_life_dashboard_statistics(
    recorder_mock, hass: HomeAssistant, hass_storage
) -> None:
    await hass.config.async_set_time_zone("Australia/Sydney")
    ld_entry = MockConfigEntry(domain="life_dashboard")
    ld_entry.add_to_hass(hass)
    er.async_get(hass).async_get_or_create(
        "sensor",
        "life_dashboard",
        "x_last_sleep_asleep",
        suggested_object_id="phone_last_sleep_asleep",
        config_entry=ld_entry,
    )
    # Hourly heart rate from 11:00 to 20:00 UTC; the night runs 12:00 to 19:31.
    first = datetime(2030, 3, 1, 11, 0, tzinfo=UTC)
    means = [70, 50, 48, 46, 44, 42, 44, 46, 60, 75]
    async_add_external_statistics(
        hass,
        StatisticMetaData(
            mean_type=StatisticMeanType.ARITHMETIC,
            has_sum=False,
            name="Heart rate",
            source="life_dashboard",
            statistic_id=f"life_dashboard:{ld_entry.entry_id.lower()}_heart_rate",
            unit_class=None,
            unit_of_measurement="bpm",
        ),
        [
            StatisticData(start=first + timedelta(hours=n), mean=m, min=m - 4, max=m + 9)
            for n, m in enumerate(means)
        ],
    )
    await async_wait_recording_done(hass)

    await setup_entry(hass)
    await push_night(hass, FIRST_WAKE)

    # Whole hours inside the night: 12:00 to 19:00, seven of them.
    assert hass.states.get("sensor.sleep_sleeping_heart_rate").state == "45.7"
    assert hass.states.get("sensor.sleep_lowest_sleeping_heart_rate").state == "38.0"
    a = hass.states.get("sensor.sleep_sleep_score").attributes
    assert (a["heart_rate_average"], a["heart_rate_lowest"]) == (45.7, 38.0)
    # The chart also gets the hour the night ends in (19:00 to 20:00), marked partial.
    assert len(a["heart_rate_hours"]) == 8
    assert a["heart_rate_hours"][0] == {
        "start": "2030-03-01T12:00:00+00:00",
        "mean": 50.0,
        "min": 46.0,
        "max": 59.0,
    }
    assert a["heart_rate_hours"][-1] == {
        "start": "2030-03-01T19:00:00+00:00",
        "mean": 60.0,
        "min": 56.0,
        "max": 69.0,
        "partial": True,
    }
