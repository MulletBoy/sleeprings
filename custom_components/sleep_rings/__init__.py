"""SleepRings: an Apple-Watch-style sleep score for Home Assistant."""

from __future__ import annotations

from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, SERVICE_RECALCULATE, STORAGE_VERSION
from .frontend import async_register_card
from .manager import SleepRingsConfigEntry, SleepRingsManager
from .statistics import async_clear_statistics, async_import_statistics
from .websocket import async_register_websocket

PLATFORMS = [Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the dashboard card and the integration's actions."""
    await async_register_card(hass)
    async_register_websocket(hass)

    async def recalculate(call: ServiceCall) -> None:
        for entry in hass.config_entries.async_loaded_entries(DOMAIN):
            await entry.runtime_data.async_recalculate()

    hass.services.async_register(DOMAIN, SERVICE_RECALCULATE, recalculate)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: SleepRingsConfigEntry) -> bool:
    """Set up one person's sleep score."""
    manager = SleepRingsManager(hass, entry)
    await manager.async_setup()
    entry.runtime_data = manager

    @callback
    def import_statistics() -> None:
        async_import_statistics(hass, manager)

    import_statistics()
    entry.async_on_unload(manager.async_add_listener(import_statistics))
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SleepRingsConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_unload()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: SleepRingsConfigEntry) -> None:
    """Delete the stored nights and the dated statistics when the entry is removed."""
    await Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}", private=True).async_remove()
    async_clear_statistics(hass, entry.entry_id)


async def _async_reload(hass: HomeAssistant, entry: SleepRingsConfigEntry) -> None:
    """Reload after the options changed (new constants rescore every night)."""
    await hass.config_entries.async_reload(entry.entry_id)
