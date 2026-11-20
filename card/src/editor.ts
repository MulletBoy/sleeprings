import { LitElement, html, nothing, type TemplateResult } from "lit";

import { DEFAULT_PRESET, presetTiles } from "./presets";
import { COLOR_KEYS, type HomeAssistant, type SleepRingsCardConfig } from "./types";

const EDITOR_TAG = "sleep-rings-card-editor";

const LABELS: Record<string, string> = {
  entity: "Sleep score entity",
  name: "Title",
  preset: "Colour preset",
  ring_style: "Ring style",
  show_rows: "Scorecard rows",
  show_hypnogram: "Sleep stages",
  show_history: "Score history",
  show_heart_rate: "Sleeping heart rate",
  sleep_goal_hours: "Sleep goal (hours)",
  heart: "Heart rate (average and high)",
  heart_low: "Heart rate (low)",
  tiles: "Tinted boxes",
  theme_background: "Use the theme's card background",
  history_nights: "Nights of history",
  colors: "Colours",
  duration: "Duration",
  duration_end: "Duration (gradient end)",
  bedtime: "Bedtime",
  bedtime_end: "Bedtime (gradient end)",
  interruptions: "Interruptions",
  interruptions_end: "Interruptions (gradient end)",
  very_low: "Band: Very Low",
  low: "Band: Low",
  ok: "Band: OK",
  high: "Band: High",
  very_high: "Band: Very High",
  awake: "Stage: Awake",
  rem: "Stage: REM",
  core: "Stage: Core",
  deep: "Stage: Deep",
};

const HELPERS: Record<string, string> = {
  colors: "Any CSS colour, for example #ff2fd6. Leave a field empty to use the preset.",
  theme_background: "Off: the Synthwave preset paints its own dark card.",
  sleep_goal_hours: "Shown on the Duration row. Empty: the duration that earns full points.",
};

const toggle = (name: string) => ({ name, selector: { boolean: {} } });

const SCHEMA = [
  {
    name: "entity",
    required: true,
    selector: { entity: { filter: { integration: "sleep_rings", domain: "sensor" } } },
  },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "preset",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "synthwave", label: "Synthwave" },
              { value: "theme", label: "Follow the theme (light or dark)" },
              { value: "health", label: "Health" },
            ],
          },
        },
      },
      {
        name: "ring_style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "concentric", label: "Three rings" },
              { value: "segmented", label: "One ring split 50 / 30 / 20" },
            ],
          },
        },
      },
    ],
  },
  {
    type: "grid",
    name: "",
    schema: [
      toggle("show_rows"),
      toggle("show_hypnogram"),
      toggle("show_history"),
      toggle("show_heart_rate"),
      toggle("tiles"),
      toggle("theme_background"),
    ],
  },
  { name: "sleep_goal_hours", selector: { number: { min: 4, max: 12, step: 0.1, mode: "box" } } },
  { name: "history_nights", selector: { number: { min: 7, max: 60, step: 1, mode: "slider" } } },
  {
    type: "expandable",
    name: "colors",
    title: LABELS.colors,
    schema: COLOR_KEYS.map((key) => ({ name: key, selector: { text: {} } })),
  },
];

export class SleepRingsCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: SleepRingsCardConfig;

  setConfig(config: SleepRingsCardConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._config) return nothing;
    // Show what the card does when an option is left out.
    const data = {
      preset: DEFAULT_PRESET,
      ring_style: "concentric",
      show_rows: true,
      show_hypnogram: true,
      show_history: true,
      show_heart_rate: true,
      history_nights: 30,
      theme_background: false,
      tiles: presetTiles(this._config.preset),
      ...this._config,
    };
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${SCHEMA}
        .computeLabel=${(field: { name: string }) => LABELS[field.name] ?? field.name}
        .computeHelper=${(field: { name: string }) => HELPERS[field.name]}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(event: CustomEvent<{ value: SleepRingsCardConfig }>): void {
    event.stopPropagation();
    const config = { ...event.detail.value };
    // Drop empty colour fields so the preset's colour applies again.
    if (config.colors) {
      const colors = Object.fromEntries(
        Object.entries(config.colors).filter(
          ([, value]) => typeof value === "string" && value.trim(),
        ),
      );
      if (Object.keys(colors).length) config.colors = colors;
      else delete config.colors;
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }
}

if (!customElements.get(EDITOR_TAG)) {
  customElements.define(EDITOR_TAG, SleepRingsCardEditor);
}
