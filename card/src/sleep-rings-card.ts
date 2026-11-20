import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";

import {
  BAND_LABELS,
  bandFor,
  bedtimeText,
  durationText,
  formatClock,
  formatMinutes,
  formatNight,
  formatTime,
  interruptionsText,
  isoDate,
  nightAge,
  parseNight,
  points,
  readEntity,
  readNight,
  todayIn,
} from "./format";
import "./editor";
import { presetTiles, styleVars } from "./presets";
import { styles } from "./styles";
import type { HomeAssistant, SleepData, SleepRingsCardConfig, StageSpan } from "./types";

export const CARD_VERSION = "1.0.1";
const CARD_TAG = "sleep-rings-card";

const PARTS = [
  { key: "duration", label: "Duration", max: 50 },
  { key: "bedtime", label: "Bedtime", max: 30 },
  { key: "interruptions", label: "Interruptions", max: 20 },
] as const;
type PartKey = (typeof PARTS)[number]["key"];

const LANES = ["awake", "rem", "core", "deep"] as const;
const LANE_LABELS = ["Awake", "REM", "Core", "Deep"];
const LANE_OF: Record<string, number> = {
  awake: 0,
  out_of_bed: 0,
  rem: 1,
  core: 2,
  light: 2,
  asleep: 2,
  sleeping: 2,
  deep: 3,
};
const LANE_PX = 26;
// Upper bounds on what the card will draw, whatever the entity or config says.
const MAX_HISTORY_NIGHTS = 60;
const MAX_STAGE_SPANS = 1000;
const MAX_NIGHT_MS = 36 * 3_600_000;
const MAX_HEART_RATE_HOURS = 36;
const BAR_PX = 12;

const fraction = (value: number | null, max: number): number =>
  value === null ? 0 : Math.min(1, Math.max(0, value / max));

export class SleepRingsCard extends LitElement {
  static styles = styles;

  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _selected: { state: true },
    _ready: { state: true },
    _today: { state: true },
    _hrHour: { state: true },
    _stage: { state: true },
    _night: { state: true },
    _detail: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: SleepRingsCardConfig;
  declare _selected: string | null;
  declare _ready: boolean;
  declare _today: string;
  declare _hrHour: number | null;
  declare _stage: number | null;
  /** Wake date being viewed; null means the newest night. */
  declare _night: string | null;
  declare _detail: SleepData | null;

  constructor() {
    super();
    this._selected = null;
    this._ready = false;
    this._today = todayIn();
    this._hrHour = null;
    this._stage = null;
    this._night = null;
    this._detail = null;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("sleep-rings-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): Partial<SleepRingsCardConfig> {
    const entity = Object.values(hass?.states ?? {}).find(
      (s) => s.entity_id.startsWith("sensor.") && "duration_points" in s.attributes,
    );
    return { entity: entity?.entity_id ?? "" };
  }

  setConfig(config: SleepRingsCardConfig): void {
    if (!config || typeof config !== "object") {
      throw new Error("Sleep Rings: the card configuration is missing");
    }
    this._config = {
      ring_style: "concentric",
      show_rows: true,
      show_hypnogram: true,
      show_history: true,
      show_heart_rate: true,
      history_nights: 30,
      history_style: "components",
      ...config,
    };
    // A pasted configuration must not be able to stall the dashboard.
    const nights = Math.round(Number(this._config.history_nights));
    this._config.history_nights = Number.isFinite(nights)
      ? Math.min(MAX_HISTORY_NIGHTS, Math.max(1, nights))
      : 30;
  }

  getCardSize(): number {
    return (
      4 +
      (this._config?.show_hypnogram ? 4 : 0) +
      (this._config?.show_history ? 2 : 0) +
      (this._config?.show_heart_rate ? 2 : 0)
    );
  }

  getGridOptions(): Record<string, number | string> {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected willUpdate(changed: PropertyValues): void {
    // Keep "today" current so the Today / Yesterday marker flips at midnight.
    if (changed.has("hass")) this._today = todayIn(this.hass?.config?.time_zone);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (this.hass && todayIn(this.hass.config?.time_zone) !== this._today) return true;
    if (changed.size > 1 || !changed.has("hass")) return true;
    const entity = this._config?.entity;
    if (!entity) return true;
    const previous = changed.get("hass") as HomeAssistant | undefined;
    return previous?.states[entity] !== this.hass?.states[entity];
  }

  protected firstUpdated(): void {
    // Draw empty first, then fill, so the rings and bars animate in.
    requestAnimationFrame(() => (this._ready = true));
  }

  protected render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;
    const entity = config.entity ? this.hass?.states[config.entity] : undefined;
    const latest = readEntity(entity);
    // An earlier night, once loaded, replaces the newest one; the history stays.
    const earlier =
      this._night && this._night !== latest.night && this._detail?.night === this._night
        ? this._detail
        : null;
    const data: SleepData = earlier ? { ...earlier, history: latest.history } : latest;
    const vars = styleVars(config.preset, config.colors, config.theme_background);

    let message = "";
    if (!config.entity) message = "Choose a sleep score entity in the card settings.";
    else if (!entity) message = `Entity not found: ${config.entity}`;
    else if (data.score === null) message = "No sleep score yet. It appears after the next recorded night.";

    const stages =
      config.show_hypnogram && data.stages.length ? this._renderHypnogram(data.stages) : nothing;
    const history =
      config.show_history && data.history.length
        ? this._renderHistory(data, config.history_nights ?? 30)
        : nothing;
    const heart =
      config.show_heart_rate && data.heartRate !== null ? this._renderHeartRate(data) : nothing;
    const hasExtras = stages !== nothing || history !== nothing || heart !== nothing;

    return html`
      <ha-card class=${(config.tiles ?? presetTiles(config.preset)) ? "tiles" : ""} style=${styleMap(vars)}>
        <div class="header">
          <span class="title">${config.name ?? "Sleep Score"}</span>
          ${data.night ? this._renderNavigation(data, latest) : nothing}
        </div>
        ${message ? html`<div class="message">${message}</div>` : nothing}
        <div class="body ${hasExtras ? "has-extras" : ""}">
          <div class="hero">
            ${this._renderRings(data, config.ring_style === "segmented")}
            ${config.show_rows ? this._renderRows(data) : nothing}
          </div>
          ${hasExtras
            ? html`<div class="extras ${heart !== nothing ? "has-hr" : ""} ${stages !== nothing ? "has-stages" : ""}">
                ${stages}${heart}${history}
              </div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private _fraction(data: SleepData, key: PartKey, max: number): number {
    return this._ready ? fraction(data[key], max) : 0;
  }

  private _renderRings(data: SleepData, segmented: boolean): TemplateResult {
    const label =
      data.score === null
        ? "Sleep score not available"
        : `Sleep score ${data.score} of 100, ${data.band ? BAND_LABELS[data.band] : ""}. ` +
          PARTS.map((p) => `${p.label} ${points(data[p.key])} of ${p.max}`).join(", ");
    return html`
      <div class="rings ${segmented ? "segmented" : "concentric"} ${data.band ? `b-${data.band}` : ""}" role="img" aria-label=${label}>
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <defs>
            ${PARTS.map(
              (part) => svg`
                <linearGradient id="sr-grad-${part.key}" class="c-${part.key}" gradientUnits="userSpaceOnUse"
                  x1="0" y1="0" x2="0" y2="160">
                  <stop offset="0" style="stop-color:currentColor"></stop>
                  <stop offset="1" style="stop-color:var(--end, currentColor)"></stop>
                </linearGradient>`,
            )}
          </defs>
          ${segmented ? this._segments(data) : this._concentric(data)}
        </svg>
        <div class="center">
          <span class="score">${data.score ?? "--"}</span>
          ${data.band
            ? html`<span class="band b-${data.band}"><span class="band-dot"></span><span>${BAND_LABELS[data.band]}</span></span>`
            : nothing}
        </div>
      </div>
    `;
  }

  /** Three concentric rings, each filled to its own maximum. */
  private _concentric(data: SleepData): TemplateResult[] {
    const radii = [70, 56, 42];
    return PARTS.map((part, index) => {
      const r = radii[index];
      const length = 2 * Math.PI * r;
      const f = this._fraction(data, part.key, part.max);
      return svg`
        <circle class="track c-${part.key}" cx="80" cy="80" r=${r} stroke-width="10"></circle>
        <circle style="stroke:url(#sr-grad-${part.key})" class="fill c-${part.key} ${f <= 0 ? "empty" : ""}" cx="80" cy="80" r=${r} stroke-width="10"
          stroke-dasharray=${length} stroke-dashoffset=${length * (1 - f)}></circle>`;
    });
  }

  /** One ring of 100 points, split 50 / 30 / 20 into three arcs. */
  private _segments(data: SleepData): TemplateResult[] {
    const r = 68;
    const width = 12;
    const length = 2 * Math.PI * r;
    const gap = width + 5;
    let used = 0;
    return PARTS.map((part) => {
      const share = part.max / 100;
      const start = used * length + gap / 2;
      const arc = share * length - gap;
      used += share;
      const filled = arc * this._fraction(data, part.key, part.max);
      return svg`
        <circle class="track c-${part.key}" cx="80" cy="80" r=${r} stroke-width=${width}
          stroke-dasharray="${arc} ${length - arc}" stroke-dashoffset=${-start}></circle>
        <circle style="stroke:url(#sr-grad-${part.key})" class="fill c-${part.key} ${filled <= 0 ? "empty" : ""}" cx="80" cy="80" r=${r} stroke-width=${width}
          stroke-dasharray="${filled} ${length - filled}" stroke-dashoffset=${-start}></circle>`;
    });
  }

  private _renderRows(data: SleepData): TemplateResult {
    const details: Record<PartKey, string> = {
      duration: durationText(data),
      bedtime: bedtimeText(data),
      interruptions: interruptionsText(data),
    };
    const language = this.hass?.locale?.language;
    const goal = this._config?.sleep_goal_hours ?? data.goalHours;
    const targets: Record<PartKey, string> = {
      duration: goal ? `Goal ${formatMinutes(goal * 60)}` : "",
      bedtime:
        data.usualOnsetMinutes !== null
          ? `Usual ${formatClock(data.usualOnsetMinutes, language)}`
          : "",
      interruptions: "",
    };
    return html`
      <div class="rows">
        ${PARTS.map(
          (part) => html`
            <div class="row c-${part.key}">
              <div class="row-head">
                <span class="dot"></span>
                <span class="row-name">${part.label}</span>
                <span class="row-pts"><b>${points(data[part.key])}</b>/${part.max}</span>
              </div>
              <div class="bar">
                <div class="bar-fill" style="width:${this._fraction(data, part.key, part.max) * 100}%"></div>
              </div>
              <div class="row-detail">
                <span>${details[part.key] || "\u00a0"}</span>
                ${targets[part.key] ? html`<span class="row-target">${targets[part.key]}</span>` : nothing}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  private _renderHypnogram(stages: StageSpan[]): TemplateResult | typeof nothing {
    const spans = stages
      .map((s) => ({ lane: LANE_OF[s.stage], start: Date.parse(s.start), end: Date.parse(s.end) }))
      .filter((s) => s.lane !== undefined && s.end > s.start)
      .slice(0, MAX_STAGE_SPANS)
      .sort((a, b) => a.start - b.start);
    if (!spans.length) return nothing;
    const t0 = spans[0].start;
    const t1 = Math.max(...spans.map((s) => s.end));
    // A night is never this long; refuse to draw (and loop over) nonsense data.
    if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 - t0 > MAX_NIGHT_MS) return nothing;
    const pct = (t: number) => ((t - t0) / (t1 - t0)) * 100;
    const language = this.hass?.locale?.language;
    const timeZone = this.hass?.config?.time_zone;
    // Minutes per lane; the percentages are shares of the time asleep.
    const totals = LANES.map((_, lane) =>
      spans.filter((sp) => sp.lane === lane).reduce((sum, sp) => sum + (sp.end - sp.start) / 60_000, 0),
    );
    const asleepTotal = totals[1] + totals[2] + totals[3];
    const inBed = (t1 - t0) / 60_000;
    const share = (minutes: number) => (asleepTotal > 0 ? Math.min(1, minutes / asleepTotal) : 0);
    const stats = [
      ...LANES.map((lane, i) => ({
        key: lane as string,
        label: LANE_LABELS[i],
        minutes: totals[i],
        percent: i > 0,
      })),
      // Deep and REM together: the restorative part of the night.
      { key: "combo", label: "Deep + REM", minutes: totals[1] + totals[3], percent: true },
    ];
    const picked = this._stage !== null ? spans[this._stage] : undefined;
    const pickedX = picked ? (pct(picked.start) + pct(picked.end)) / 2 : 0;
    const barTop = (lane: number) => lane * LANE_PX + (LANE_PX - BAR_PX) / 2;

    const links: TemplateResult[] = [];
    for (let i = 1; i < spans.length; i++) {
      const a = spans[i - 1];
      const b = spans[i];
      if (a.lane === b.lane || b.start - a.end > 60_000) continue;
      const [upper, lower] = a.lane < b.lane ? [a.lane, b.lane] : [b.lane, a.lane];
      links.push(html`<div
        class="link"
        style="left:${pct(b.start)}%;top:${upper * LANE_PX + LANE_PX / 2}px;height:${(lower - upper) * LANE_PX}px;
          background:linear-gradient(var(--_${LANES[upper]}),var(--_${LANES[lower]}))"
      ></div>`);
    }

    // Hour marks; label every hour on short nights, every second one otherwise.
    const ticks: { at: number; label: string }[] = [];
    const first = new Date(t0);
    let minute = first.getMinutes();
    try {
      minute = Number(
        new Intl.DateTimeFormat("en", { minute: "numeric", timeZone }).format(first),
      );
    } catch {
      /* unknown time zone: fall back to the browser's */
    }
    const step = t1 - t0 > 6 * 3_600_000 ? 2 : 1;
    let count = 0;
    for (let at = t0 + ((60 - minute) % 60) * 60_000; at < t1; at += 3_600_000, count++) {
      if (count % step) continue;
      const position = pct(at);
      if (position < 4 || position > 96) continue;
      let label: string;
      try {
        label = new Date(at).toLocaleTimeString(language, { hour: "numeric", timeZone });
      } catch {
        label = new Date(at).toLocaleTimeString(language, { hour: "numeric" });
      }
      ticks.push({ at, label });
    }

    return html`
      <div class="section stages">
        <div class="section-head">
          <span>Stages</span>
          <span>${formatTime(new Date(t0), language, timeZone)} ${"\u2013"} ${formatTime(new Date(t1), language, timeZone)}</span>
        </div>
        <div class="hypno" role="img" aria-label="Sleep stages through the night">
          <div class="lane-labels">${LANE_LABELS.map((l) => html`<span>${l}</span>`)}</div>
          <div class="plot" @pointerleave=${() => (this._stage = null)}>
            ${LANES.map((lane, i) => html`<div class="lane-band s-${lane}" style="top:${i * LANE_PX}px"></div>`)}
            ${ticks.map((t) => html`<div class="tick" style="left:${pct(t.at)}%"></div>`)}
            ${links}
            ${spans.map(
              (s, i) => html`<button
                class="stage s-${LANES[s.lane]} ${this._stage === i ? "selected" : ""}"
                style="left:${pct(s.start)}%;width:${pct(s.end) - pct(s.start)}%;top:${barTop(s.lane)}px"
                aria-label="${LANE_LABELS[s.lane]}, ${formatTime(new Date(s.start), language, timeZone)} to ${formatTime(new Date(s.end), language, timeZone)}"
                @pointerenter=${() => (this._stage = i)}
                @focus=${() => (this._stage = i)}
                @blur=${() => (this._stage = null)}
                @click=${() => (this._stage = i)}
              ></button>`,
            )}
            ${picked
              ? html`<div
                  class="hr-tip s-${LANES[picked.lane]} ${pickedX > 55 ? "left" : ""} ${picked.lane < 2 ? "below" : ""}"
                  style="left:${pickedX}%"
                >
                  <span><i></i><b>${LANE_LABELS[picked.lane]}</b><u>${formatMinutes((picked.end - picked.start) / 60_000)}</u></span>
                  <em>${formatTime(new Date(picked.start), language, timeZone)} ${"\u2013"} ${formatTime(new Date(picked.end), language, timeZone)}</em>
                </div>`
              : nothing}
          </div>
          <div class="axis">${ticks.map((t) => html`<span style="left:${pct(t.at)}%">${t.label}</span>`)}</div>
        </div>
        <div class="night-summary">
          <span>In bed <b>${formatMinutes(inBed)}</b></span>
          <span>Asleep <b>${formatMinutes(asleepTotal)}</b></span>
          <span>Efficiency <b>${inBed > 0 ? Math.round((asleepTotal / inBed) * 100) : 0}%</b></span>
        </div>
        <div class="stage-stats">
          ${stats.map(
            (stat) => html`
              <div class="stat s-${stat.key}">
                <span class="dot"></span>
                <span class="stat-name">${stat.label}</span>
                <span class="stat-bar"><i style="width:${share(stat.minutes) * 100}%"></i></span>
                <span class="stat-value">${formatMinutes(stat.minutes)}</span>
                <span class="stat-pct">${stat.percent ? `${Math.round(share(stat.minutes) * 100)}%` : ""}</span>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  /** Show a night: the newest from the entity, an earlier one from the integration. */
  private async _go(night: string | undefined, latestNight: string | null): Promise<void> {
    if (!night) return;
    this._stage = null;
    this._hrHour = null;
    if (night === latestNight) {
      this._night = null;
      this._detail = null;
      return;
    }
    this._night = night;
    const entity = this._config?.entity;
    if (!entity || !this.hass?.callWS) return;
    try {
      const result = await this.hass.callWS<Record<string, unknown>>({
        type: "sleep_rings/night",
        entity_id: entity,
        night,
      });
      // Ignore the answer if the viewer has moved on meanwhile.
      if (this._night === night) {
        const score = Number(result.score);
        this._detail = readNight(result, Number.isFinite(score) ? score : null);
      }
    } catch {
      if (this._night === night) {
        this._night = null;
        this._detail = null;
      }
    }
  }

  /** Date with arrows and a date picker, to look at earlier nights. */
  private _renderNavigation(data: SleepData, latest: SleepData): TemplateResult {
    const language = this.hass?.locale?.language;
    const nights = latest.history.map((h) => h.night);
    if (latest.night && !nights.includes(latest.night)) nights.push(latest.night);
    nights.sort();
    const current = this._night ?? latest.night ?? "";
    const index = nights.indexOf(current);
    const previous = index > 0 ? nights[index - 1] : undefined;
    const next = index >= 0 && index < nights.length - 1 ? nights[index + 1] : undefined;
    const loading = this._night !== null && data.night !== this._night;
    const pick = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      if (!value) return;
      // The nearest recorded night on or before the chosen date, else the first one.
      const onOrBefore = nights.filter((n) => n <= value);
      void this._go(onOrBefore.length ? onOrBefore[onOrBefore.length - 1] : nights[0], latest.night);
    };
    const openPicker = (event: Event) => {
      const input = (event.currentTarget as HTMLElement).querySelector("input");
      try {
        input?.showPicker();
      } catch {
        input?.focus();
      }
    };
    return html`
      <span class="night">
        ${this._renderAge(current, this._night !== null)}
        <button class="nav-btn" ?disabled=${!previous} aria-label="Previous night"
          @click=${() => this._go(previous, latest.night)}>\u2039</button>
        <button class="date-btn ${loading ? "loading" : ""}" aria-label="Choose a night" @click=${openPicker}>
          ${formatNight(current, language)}
          <input type="date" tabindex="-1" aria-hidden="true" .value=${current}
            min=${nights[0] ?? ""} max=${nights[nights.length - 1] ?? ""}
            @click=${(event: Event) => event.stopPropagation()} @change=${pick} />
        </button>
        <button class="nav-btn" ?disabled=${!next} aria-label="Next night"
          @click=${() => this._go(next, latest.night)}>\u203a</button>
      </span>
    `;
  }

  /** "Today" when the night ended today, otherwise how old the shown night is. */
  private _renderAge(night: string, earlier = false): TemplateResult | typeof nothing {
    const age = nightAge(night, this._today);
    if (age < 0) return nothing;
    const label = age === 0 ? "Today" : age === 1 ? "Yesterday" : `${age} days ago`;
    const title = earlier
      ? "You are looking at an earlier night"
      : age === 0
        ? "This is the night you woke up from today"
        : "No sleep has been recorded for today yet";
    // Looking back on purpose is not a warning, so an earlier night gets a neutral marker.
    const tone = earlier ? "past" : age === 0 ? "fresh" : age === 1 ? "recent" : "old";
    return html`<span class="age ${tone}" title=${title}>${label}</span>`;
  }

  /**
   * Hourly heart rate through the night: a smooth average line over a soft
   * area, with dashed lines for each hour's high and low.
   */
  private _renderHeartRate(data: SleepData): TemplateResult {
    const language = this.hass?.locale?.language;
    const timeZone = this.hass?.config?.time_zone;
    const hours = data.heartRateHours
      .slice(0, MAX_HEART_RATE_HOURS)
      .filter((h) => Number.isFinite(h.mean) && Number.isFinite(Date.parse(h.start)))
      .map((h) => ({
        at: Date.parse(h.start),
        mean: h.mean,
        low: h.min ?? h.mean,
        high: h.max ?? h.mean,
        partial: h.partial === true,
      }));
    const hourLabel = (at: number) => {
      try {
        return new Date(at).toLocaleTimeString(language, { hour: "numeric", timeZone });
      } catch {
        return new Date(at).toLocaleTimeString(language, { hour: "numeric" });
      }
    };
    const summary =
      `${Math.round(data.heartRate ?? 0)} bpm` +
      (data.heartRateLow !== null ? ` \u00b7 low ${Math.round(data.heartRateLow)}` : "");

    let chart: TemplateResult | typeof nothing = nothing;
    if (hours.length >= 2) {
      // Scale to the hours fully inside the night. The first and last hour can
      // include time awake (a walk to bed, an alarm), which would flatten the rest.
      const scaled = hours.some((h) => !h.partial) ? hours.filter((h) => !h.partial) : hours;
      const bottom = Math.floor((Math.min(...scaled.map((h) => h.low)) - 1) / 5) * 5;
      const top = Math.ceil((Math.max(...scaled.map((h) => h.high)) + 1) / 5) * 5;
      const range = Math.max(5, top - bottom);
      const x = (i: number) => ((i + 0.5) / hours.length) * 100;
      // Percent of the plot height; values outside the scale sit on its edge.
      const y = (v: number) => (1 - Math.min(1, Math.max(0, (v - bottom) / range))) * 100;
      const clampY = (v: number) => Math.min(100, Math.max(0, v));
      // A smooth curve through the points (Catmull-Rom converted to Bezier segments).
      const curve = (pick: (h: (typeof hours)[number]) => number) => {
        const p = hours.map((h, i) => [x(i), y(pick(h))]);
        let d = `M${p[0][0].toFixed(2)},${p[0][1].toFixed(2)}`;
        for (let i = 0; i < p.length - 1; i++) {
          const before = p[Math.max(0, i - 1)];
          const after = p[Math.min(p.length - 1, i + 2)];
          const c1 = [p[i][0] + (p[i + 1][0] - before[0]) / 6, clampY(p[i][1] + (p[i + 1][1] - before[1]) / 6)];
          const c2 = [p[i + 1][0] - (after[0] - p[i][0]) / 6, clampY(p[i + 1][1] - (after[1] - p[i][1]) / 6)];
          d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p[i + 1][0].toFixed(2)},${p[i + 1][1].toFixed(2)}`;
        }
        return d;
      };
      const average = curve((h) => h.mean);
      const area = `${average} L${x(hours.length - 1).toFixed(2)},100 L${x(0).toFixed(2)},100 Z`;
      const ticks = [top, bottom + range / 2, bottom];
      const labelEvery = hours.length > 6 ? 2 : 1;
      const selected = this._hrHour !== null ? hours[this._hrHour] : undefined;
      const selectedX = this._hrHour !== null ? x(this._hrHour) : 0;

      chart = html`
        <div class="hr-chart">
          <div class="hr-yaxis">${ticks.map((t) => html`<span>${Math.round(t)}</span>`)}</div>
          <div class="hr-plot" @pointerleave=${() => (this._hrHour = null)}>
            ${ticks.map((_, i) => html`<div class="hr-grid" style="top:${i * 50}%"></div>`)}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path class="hr-area" d=${area}></path>
              <path class="hr-line high" d=${curve((h) => h.high)}></path>
              <path class="hr-line low" d=${curve((h) => h.low)}></path>
              <path class="hr-line avg" d=${average}></path>
            </svg>
            ${selected
              ? html`
                  <div class="hr-guide" style="left:${selectedX}%"></div>
                  <i class="hr-dot high" style="left:${selectedX}%;top:${y(selected.high)}%"></i>
                  <i class="hr-dot avg" style="left:${selectedX}%;top:${y(selected.mean)}%"></i>
                  <i class="hr-dot low" style="left:${selectedX}%;top:${y(selected.low)}%"></i>
                  <div class="hr-tip ${selectedX > 55 ? "left" : ""}" style="left:${selectedX}%">
                    <b>${hourLabel(selected.at)} \u2013 ${hourLabel(selected.at + 3_600_000)}</b>
                    ${selected.partial ? html`<em>partly awake</em>` : nothing}
                    <span class="high"><i></i>Hourly high<u>${Math.round(selected.high)} bpm</u></span>
                    <span class="avg"><i></i>Average<u>${Math.round(selected.mean)} bpm</u></span>
                    <span class="low"><i></i>Hourly low<u>${Math.round(selected.low)} bpm</u></span>
                  </div>
                `
              : nothing}
            ${hours.map(
              (h, i) => html`<button
                class="hr-hit"
                style="left:${(i / hours.length) * 100}%;width:${100 / hours.length}%"
                aria-label="${hourLabel(h.at)}: average ${Math.round(h.mean)}, high ${Math.round(h.high)}, low ${Math.round(h.low)} bpm"
                @pointerenter=${() => (this._hrHour = i)}
                @focus=${() => (this._hrHour = i)}
                @blur=${() => (this._hrHour = null)}
                @click=${() => (this._hrHour = i)}
              ></button>`,
            )}
          </div>
          <div class="hr-xaxis">
            ${hours.map((h, i) =>
              i % labelEvery === 0
                ? html`<span style="left:${(i / hours.length) * 100}%">${hourLabel(h.at)}</span>`
                : nothing,
            )}
          </div>
        </div>
        <div class="hr-legend">
          <span class="high"><i></i>Hourly high</span>
          <span class="avg"><i></i>Average</span>
          <span class="low"><i></i>Hourly low</span>
        </div>
      `;
    }
    return html`
      <div class="section heart">
        <div class="section-head">
          <span>Sleeping heart rate</span>
          <span class="hr-summary">${summary}</span>
        </div>
        ${chart}
      </div>
    `;
  }

  private _renderHistory(data: SleepData, nights: number): TemplateResult {
    const language = this.hass?.locale?.language;
    const byNight = new Map(data.history.map((h) => [h.night, h]));
    const latestNight = data.history[data.history.length - 1].night;
    const last = parseNight(latestNight);
    const days: string[] = [];
    for (let back = Math.max(1, nights) - 1; back >= 0; back--) {
      const day = new Date(last);
      day.setDate(last.getDate() - back);
      days.push(isoDate(day));
    }
    const shown = days.map((d) => byNight.get(d)).filter((h) => h !== undefined);
    const average = shown.length
      ? `Average ${Math.round(shown.reduce((sum, h) => sum + h.score, 0) / shown.length)}`
      : "";
    const viewing = data.night ?? latestNight;
    const hovered = this._selected ? byNight.get(this._selected) : undefined;
    const hoveredX = hovered ? ((days.indexOf(hovered.night) + 0.5) / days.length) * 100 : 0;
    const components = this._config?.history_style !== "bands";
    const clamp = (value: number | undefined) => Math.max(0, Math.min(100, value ?? 0));
    const labelEvery = days.length > 14 ? 7 : days.length > 7 ? 2 : 1;
    const shortDate = (day: string) =>
      parseNight(day).toLocaleDateString(language, { day: "numeric", month: "short" });

    return html`
      <div class="section nights">
        <div class="section-head">
          <span>${nights} nights</span>
          <span>${average}</span>
        </div>
        <div class="hr-chart">
          <div class="hr-yaxis"><span>100</span><span>50</span><span>0</span></div>
          <div class="hr-plot" @pointerleave=${() => (this._selected = null)}>
            ${[0, 50, 100].map((top) => html`<div class="hr-grid" style="top:${top}%"></div>`)}
            <div class="night-cols">
              ${days.map((day) => {
                const entry = byNight.get(day);
                if (!entry) return html`<span class="night-col missing"></span>`;
                const stacked = components && entry.d !== undefined && entry.b !== undefined && entry.i !== undefined;
                return html`<button
                  class="night-col ${entry.estimated ? "estimated" : ""} ${day === viewing ? "current" : ""} ${this._selected === day ? "selected" : ""}"
                  aria-label="${formatNight(day, language)}: score ${entry.score}. Show this night."
                  @pointerenter=${() => (this._selected = day)}
                  @focus=${() => (this._selected = day)}
                  @blur=${() => (this._selected = null)}
                  @click=${() => this._go(day, latestNight)}
                >
                  ${stacked
                    ? html`<i class="c-duration" style="height:${clamp(entry.d)}%"></i
                        ><i class="c-bedtime" style="height:${clamp(entry.b)}%"></i
                        ><i class="c-interruptions" style="height:${clamp(entry.i)}%"></i>`
                    : html`<i class="b-${bandFor(entry.score)}" style="height:${clamp(entry.score)}%"></i>`}
                </button>`;
              })}
            </div>
            ${hovered
              ? html`<div class="hr-tip ${hoveredX > 55 ? "left" : ""}" style="left:${hoveredX}%">
                  <b>${formatNight(hovered.night, language)}</b>
                  <span class="b-${bandFor(hovered.score)}"><i></i>Score<u>${hovered.score}</u></span>
                  ${hovered.d !== undefined
                    ? html`<span class="c-duration"><i></i>Duration<u>${hovered.d} / 50</u></span>
                        <span class="c-bedtime"><i></i>Bedtime<u>${hovered.b} / 30</u></span>
                        <span class="c-interruptions"><i></i>Interruptions<u>${hovered.i} / 20</u></span>`
                    : nothing}
                  ${hovered.estimated ? html`<em>estimated: no stage data</em>` : nothing}
                </div>`
              : nothing}
          </div>
          <div class="hr-xaxis">
            ${days.map((day, i) =>
              (days.length - 1 - i) % labelEvery === 0
                ? html`<span class="centered" style="left:${((i + 0.5) / days.length) * 100}%">${shortDate(day)}</span>`
                : nothing,
            )}
          </div>
        </div>
        ${components
          ? html`<div class="hr-legend">
              <span class="c-duration"><i></i><b>Duration</b></span>
              <span class="c-bedtime"><i></i><b>Bedtime</b></span>
              <span class="c-interruptions"><i></i><b>Interruptions</b></span>
            </div>`
          : nothing}
      </div>
    `;
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SleepRingsCard);
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Sleep Rings",
    description: "Sleep score with rings, a scorecard, sleep stages and history.",
    preview: true,
  });
}

console.info(`%c SLEEP-RINGS-CARD %c ${CARD_VERSION} `, "background:#6e6adf;color:#fff", "");
