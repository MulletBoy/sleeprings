"""WebSocket API: lets the dashboard card read any stored night, not just the newest."""

from __future__ import annotations

import re
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er

from .const import DOMAIN

NIGHT = re.compile(r"\d{4}-\d{2}-\d{2}")


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register the commands."""
    websocket_api.async_register_command(hass, websocket_night)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "sleep_rings/night",
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("night"): vol.All(str, vol.Match(NIGHT)),
    }
)
@websocket_api.async_response
async def websocket_night(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return one night's details, in the same shape as the score sensor's attributes.

    ``entity_id`` is any entity of the SleepRings device; ``night`` is the wake date.
    """
    registry_entry = er.async_get(hass).async_get(msg["entity_id"])
    entry = (
        hass.config_entries.async_get_entry(registry_entry.config_entry_id)
        if registry_entry and registry_entry.config_entry_id
        else None
    )
    if entry is None or entry.domain != DOMAIN or entry.state is not ConfigEntryState.LOADED:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Not a SleepRings entity")
        return
    details = await entry.runtime_data.async_night_details(msg["night"])
    if details is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "No such night")
        return
    connection.send_result(msg["id"], details)
