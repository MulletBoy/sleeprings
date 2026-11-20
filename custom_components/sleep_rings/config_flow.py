"""Config flow for SleepRings."""

from __future__ import annotations

from dataclasses import fields
from math import isfinite
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.data_entry_flow import section
from homeassistant.helpers import selector

from .const import (
    CONF_FORMULA,
    CONF_SLEEP_ENTITY,
    CONF_SOURCE,
    CONF_TIME_ZONE_ATTRIBUTE,
    CONF_TIME_ZONE_ENTITY,
    DEFAULT_TIME_ZONE_ATTRIBUTE,
    DOMAIN,
)
from .formula import DEFAULTS, LIMITS, Constants
from .sources import detect_source

DEFAULT_NAME = "Sleep"

# The part maximums (50 / 30 / 20) are Apple's published structure, not tunable.
FORMULA_FIELDS = [f.name for f in fields(Constants) if f.name in LIMITS]
BAND_FIELDS = ("band_low", "band_ok", "band_high", "band_very_high")


def _time_zone_schema(defaults: dict[str, Any]) -> dict[Any, Any]:
    entity = defaults.get(CONF_TIME_ZONE_ENTITY)
    return {
        vol.Optional(
            CONF_TIME_ZONE_ENTITY,
            description={"suggested_value": entity} if entity else None,
        ): selector.EntitySelector(),
        vol.Optional(
            CONF_TIME_ZONE_ATTRIBUTE,
            default=defaults.get(CONF_TIME_ZONE_ATTRIBUTE, DEFAULT_TIME_ZONE_ATTRIBUTE),
        ): selector.TextSelector(),
    }


def _formula_schema(current: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(
                name, default=current.get(name, getattr(DEFAULTS, name))
            ): selector.NumberSelector(
                selector.NumberSelectorConfig(
                    mode=selector.NumberSelectorMode.BOX,
                    step="any",
                    min=LIMITS[name][0],
                    max=LIMITS[name][1],
                )
            )
            for name in FORMULA_FIELDS
        }
    )


def _formula_is_valid(values: dict[str, Any]) -> bool:
    """Check submitted constants on the server; the selector limits are only a UI hint."""
    try:
        numbers = {name: float(values[name]) for name in FORMULA_FIELDS if name in values}
    except TypeError, ValueError:
        return False
    for name, number in numbers.items():
        low, high = LIMITS[name]
        if not isfinite(number) or not low <= number <= high:
            return False
    bands = [numbers.get(n, getattr(DEFAULTS, n)) for n in BAND_FIELDS]
    return bands == sorted(bands) and len(set(bands)) == len(bands)


class SleepRingsConfigFlow(ConfigFlow, domain=DOMAIN):
    """Set up a sleep score for one person."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Pick the sleep entity and, optionally, where the phone's zone comes from."""
        errors: dict[str, str] = {}
        if user_input is not None:
            entity_id = user_input[CONF_SLEEP_ENTITY]
            state = self.hass.states.get(entity_id)
            source = detect_source(state) if state is not None else None
            if source is None:
                errors[CONF_SLEEP_ENTITY] = "not_a_sleep_entity"
            else:
                await self.async_set_unique_id(entity_id)
                self._abort_if_unique_id_configured()
                options = {
                    CONF_TIME_ZONE_ATTRIBUTE: user_input.get(
                        CONF_TIME_ZONE_ATTRIBUTE, DEFAULT_TIME_ZONE_ATTRIBUTE
                    )
                }
                if user_input.get(CONF_TIME_ZONE_ENTITY):
                    options[CONF_TIME_ZONE_ENTITY] = user_input[CONF_TIME_ZONE_ENTITY]
                return self.async_create_entry(
                    title=user_input[CONF_NAME],
                    data={CONF_SOURCE: source, CONF_SLEEP_ENTITY: entity_id},
                    options=options,
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME, default=DEFAULT_NAME): selector.TextSelector(),
                vol.Required(CONF_SLEEP_ENTITY): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                **_time_zone_schema({}),
            }
        )
        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(schema, user_input),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> SleepRingsOptionsFlow:
        """Return the options flow."""
        return SleepRingsOptionsFlow()


class SleepRingsOptionsFlow(OptionsFlow):
    """Change the time zone entity and the formula constants."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Show or save the options."""
        errors: dict[str, str] = {}
        if user_input is not None and not _formula_is_valid(user_input.get(CONF_FORMULA, {})):
            errors["base"] = "invalid_formula"
        elif user_input is not None:
            options: dict[str, Any] = {
                CONF_TIME_ZONE_ATTRIBUTE: user_input.get(
                    CONF_TIME_ZONE_ATTRIBUTE, DEFAULT_TIME_ZONE_ATTRIBUTE
                )
            }
            if user_input.get(CONF_TIME_ZONE_ENTITY):
                options[CONF_TIME_ZONE_ENTITY] = user_input[CONF_TIME_ZONE_ENTITY]
            # Keep only the constants that differ from the model's defaults, so a
            # later model version changes everything the user did not touch.
            changed = {
                name: value
                for name, value in user_input.get(CONF_FORMULA, {}).items()
                if name in FORMULA_FIELDS and float(value) != float(getattr(DEFAULTS, name))
            }
            if changed:
                options[CONF_FORMULA] = changed
            return self.async_create_entry(data=options)

        current = self.config_entry.options
        schema = vol.Schema(
            {
                **_time_zone_schema(dict(current)),
                vol.Required(CONF_FORMULA): section(
                    _formula_schema(current.get(CONF_FORMULA, {})), {"collapsed": True}
                ),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema, errors=errors)
