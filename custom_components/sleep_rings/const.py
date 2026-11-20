"""Constants for SleepRings."""

from __future__ import annotations

DOMAIN = "sleep_rings"

CONF_SOURCE = "source"
CONF_SLEEP_ENTITY = "sleep_entity"
CONF_TIME_ZONE_ENTITY = "time_zone_entity"
CONF_TIME_ZONE_ATTRIBUTE = "time_zone_attribute"
CONF_FORMULA = "formula"

SOURCE_LIFE_DASHBOARD = "life_dashboard"

# The iOS companion app's geocoded location sensor carries the phone's zone here.
DEFAULT_TIME_ZONE_ATTRIBUTE = "Time Zone"

STORAGE_VERSION = 1
STORED_NIGHTS = 90  # kept on disk
HISTORY_NIGHTS = 60  # exposed in the history attribute
SEED_NIGHTS = 90  # past nights taken from the source on first setup

SERVICE_RECALCULATE = "recalculate"
