import { COLOR_KEYS, type ColorKey, type Colors } from "./types";

interface Preset {
  colors: Colors;
  /** Extra CSS custom properties (text colour, glow...). */
  vars?: Record<string, string>;
  /** Card background, skipped when the card is told to keep the theme's. */
  background?: Record<string, string>;
  /** Draw each row and section as a tinted, glowing box. */
  tiles?: boolean;
}

export const DEFAULT_PRESET = "synthwave";

/**
 * "theme" sets nothing: the stylesheet's fallbacks apply, so the card follows
 * the Home Assistant theme (light or dark), and a theme can override colours
 * with --sleep-rings-<name>-color.
 */
export const PRESETS: Record<string, Preset> = {
  theme: {
    // Base colours come from the stylesheet (and the HA theme); only the
    // second colour of each ring's gradient is set here.
    colors: { duration_end: "#a78bfa", bedtime_end: "#34d3b4", interruptions_end: "#f97316" },
    tiles: true,
  },
  synthwave: {
    colors: {
      duration: "#ffb224",
      bedtime: "#ff2fd6",
      interruptions: "#5df0a8",
      duration_end: "#ff7a3d",
      bedtime_end: "#a46bff",
      interruptions_end: "#4df3ff",
      very_low: "#ff2fd6",
      low: "#ffb224",
      ok: "#a46bff",
      high: "#4df3ff",
      very_high: "#5df0a8",
      awake: "#ffb224",
      rem: "#4df3ff",
      core: "#3d7bff",
      deep: "#6d3dff",
      heart: "#ff2fd6",
      heart_low: "#a46bff",
    },
    vars: {
      "--sr-text": "#f1e8ff",
      "--sr-secondary-text": "#b9a6d6",
      "--sr-divider": "#3b1c66",
      "--sr-track": "rgba(185,166,214,0.10)",
      "--sr-track-opacity": "1",
      "--sr-accent-text": "currentColor",
      "--sr-glow": "6px",
      "--sr-tile-fill": "12%",
      "--sr-tile-border": "45%",
      "--sr-tile-glow": "18%",
      "--sr-tile-inset": "7%",
      "--sr-title-tint": "100%",
      "--sr-halo": "13%",
      "--sr-score-glow": "45%",
      "--sr-stages-tint": "#a46bff",
      "--sr-history-tint": "#4df3ff",
    },
    tiles: true,
    // A neon palette needs a dark card, whatever the dashboard theme is.
    background: { "--ha-card-background": "#16082b", "--ha-card-border-color": "#3b1c66" },
  },
  health: {
    colors: {
      duration: "#5e5ce6",
      bedtime: "#32ade6",
      interruptions: "#ff9f0a",
      duration_end: "#bf5af2",
      bedtime_end: "#64d2ff",
      interruptions_end: "#ff6b5e",
      very_low: "#ff453a",
      low: "#ff9f0a",
      ok: "#ffd60a",
      high: "#30d158",
      very_high: "#40c8e0",
      awake: "#ff6b5e",
      rem: "#5ac8fa",
      core: "#0a84ff",
      deep: "#3634a3",
      heart: "#ff375f",
      heart_low: "#bf5af2",
    },
    tiles: true,
  },
};

const SAFE_COLOR =
  /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla)\([0-9.,%\s/deg-]+\)|var\(--[a-z0-9-]+\))$/i;

/** Only let plain colour values into the style attribute. */
export function safeColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return SAFE_COLOR.test(trimmed) ? trimmed : undefined;
}

/** Look a preset up by name; anything unknown (including "constructor") gets the default. */
function getPreset(name: string | undefined): Preset {
  const key = typeof name === "string" ? name : DEFAULT_PRESET;
  return Object.prototype.hasOwnProperty.call(PRESETS, key) ? PRESETS[key] : PRESETS[DEFAULT_PRESET];
}

/** Whether a preset draws tinted boxes unless the card says otherwise. */
export function presetTiles(preset: string | undefined): boolean {
  return getPreset(preset).tiles ?? false;
}

/** CSS custom properties for a preset plus per-card colour overrides. */
export function styleVars(
  preset: string | undefined,
  colors: Colors | undefined,
  themeBackground = false,
): Record<string, string> {
  const chosen = getPreset(preset);
  const vars: Record<string, string> = {
    ...(chosen.vars ?? {}),
    ...(themeBackground ? {} : (chosen.background ?? {})),
  };
  for (const key of COLOR_KEYS) {
    const value = safeColor(colors?.[key]) ?? chosen.colors[key as ColorKey];
    if (value) vars[`--sr-${key.replace("_", "-")}`] = value;
  }
  return vars;
}
