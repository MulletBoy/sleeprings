import { css } from "lit";

/**
 * Colour resolution, most specific first:
 *   --sr-*                     set inline from the card's preset / colors
 *   --sleep-rings-*-color      optional, from a Home Assistant theme
 *   built-in fallback          mid-tones that read on light and dark cards
 */
export const styles = css`
  :host {
    display: block;
    container-type: inline-size;
  }

  /* Colour tokens live on ha-card, where the preset's --sr-* values are set inline. */
  ha-card {
    --_duration: var(--sr-duration, var(--sleep-rings-duration-color, #6e6adf));
    --_bedtime: var(--sr-bedtime, var(--sleep-rings-bedtime-color, #2aa9c9));
    --_interruptions: var(--sr-interruptions, var(--sleep-rings-interruptions-color, #f59e0b));
    --_very-low: var(--sr-very-low, var(--sleep-rings-very-low-color, #ef4444));
    --_low: var(--sr-low, var(--sleep-rings-low-color, #f59e0b));
    --_ok: var(--sr-ok, var(--sleep-rings-ok-color, #eab308));
    --_high: var(--sr-high, var(--sleep-rings-high-color, #22c55e));
    --_very-high: var(--sr-very-high, var(--sleep-rings-very-high-color, #14b8a6));
    --_awake: var(--sr-awake, var(--sleep-rings-awake-color, #f97316));
    --_rem: var(--sr-rem, var(--sleep-rings-rem-color, #38bdf8));
    --_core: var(--sr-core, var(--sleep-rings-core-color, #3b82f6));
    --_deep: var(--sr-deep, var(--sleep-rings-deep-color, #4f46e5));
    --_heart: var(--sr-heart, var(--sleep-rings-heart-color, #ef4444));
    --_heart-low: var(--sr-heart-low, var(--sleep-rings-heart-low-color, #8b5cf6));
    --_text: var(--sr-text, var(--primary-text-color, #1c1c1e));
    --_text2: var(--sr-secondary-text, var(--secondary-text-color, #6b6b70));
    --_divider: var(--sr-divider, var(--divider-color, rgba(127, 127, 127, 0.25)));
    --_accent-text: var(--sr-accent-text, var(--_text));
    --_glow: var(--sr-glow, 0px);
    --_lane: 26px;
  }

  ha-card {
    display: block;
    padding: 16px;
    color: var(--_text);
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .night {
    font-size: 12px;
    color: var(--_text2);
    white-space: nowrap;
  }

  /* Hero: rings beside the scorecard, stacked on narrow cards */
  .hero {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .rings {
    position: relative;
    flex: 0 0 164px;
    width: 164px;
    height: 164px;
  }
  .rings svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    overflow: visible;
  }
  .track,
  .fill {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
  }
  .track {
    stroke: var(--sr-track, currentColor);
    opacity: var(--sr-track-opacity, 0.16);
  }
  .fill {
    transition:
      stroke-dashoffset 0.7s ease,
      stroke-dasharray 0.7s ease;
    filter: drop-shadow(0 0 calc(var(--_glow) * 0.5) color-mix(in srgb, currentColor 55%, transparent));
  }
  .fill.empty {
    opacity: 0;
  }
  .c-duration {
    color: var(--_duration);
    --end: var(--sr-duration-end, var(--_duration));
  }
  .c-bedtime {
    color: var(--_bedtime);
    --end: var(--sr-bedtime-end, var(--_bedtime));
  }
  .c-interruptions {
    color: var(--_interruptions);
    --end: var(--sr-interruptions-end, var(--_interruptions));
  }

  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: none;
    color: var(--_text);
  }
  .score {
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .segmented .score {
    font-size: 46px;
  }
  .band {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
  .band span:last-child {
    color: var(--sr-accent-text, var(--_text2));
  }
  .segmented .band {
    font-size: 12px;
    margin-top: 6px;
  }
  .band-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) currentColor;
  }
  .b-very_low {
    color: var(--_very-low);
    --band: var(--_very-low);
  }
  .b-low {
    color: var(--_low);
    --band: var(--_low);
  }
  .b-ok {
    color: var(--_ok);
    --band: var(--_ok);
  }
  .b-high {
    color: var(--_high);
    --band: var(--_high);
  }
  .b-very_high {
    color: var(--_very-high);
    --band: var(--_very-high);
  }

  .rows {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: var(--sr-panel-pad, 0);
    border: 1px solid var(--sr-panel-border, transparent);
    border-radius: 12px;
    background: var(--sr-panel-bg, transparent);
  }
  .row-head {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 13px;
  }
  .dot {
    align-self: center;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
  }
  .row-name {
    flex: 1;
    font-weight: 600;
    color: var(--_accent-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-pts {
    color: var(--_text2);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .row-pts b {
    color: var(--_text);
    font-size: 15px;
    font-weight: 700;
  }
  .bar {
    height: 5px;
    margin: 5px 0 4px;
    border-radius: 3px;
    background: var(--sr-track, color-mix(in srgb, currentColor 16%, transparent));
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, currentColor, var(--end, currentColor));
    box-shadow: 0 0 var(--_glow) color-mix(in srgb, currentColor 60%, transparent);
    transition: width 0.7s ease;
  }
  .row-detail {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--_text2);
  }
  .row-target {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  /* Marker beside the date: is this today's night or an older one? */
  .age {
    display: inline-block;
    margin-right: 8px;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
    background: color-mix(in srgb, currentColor 12%, transparent);
  }
  .age.fresh {
    color: var(--_very-high);
  }
  .age.recent {
    color: var(--_low);
  }
  .age.old {
    color: var(--_very-low);
  }

  /* Minutes and share of each stage, under the hypnogram */
  .stage-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
    gap: 6px 14px;
    margin-top: 8px;
    font-size: 12px;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .stat-name {
    color: var(--_text2);
  }
  /* Bars and the combined row only appear where the panel has room (wide layout). */
  .stat-bar,
  .stat.s-combo {
    display: none;
  }
  .stat-bar {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: var(--sr-track, color-mix(in srgb, currentColor 16%, transparent));
    overflow: hidden;
  }
  .stat-bar i {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) color-mix(in srgb, currentColor 60%, transparent);
  }
  .s-combo {
    color: var(--_rem);
  }
  .s-combo .dot,
  .s-combo .stat-bar i {
    background: linear-gradient(90deg, var(--_deep), var(--_rem));
  }
  .night-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    margin-top: 8px;
    font-size: 12px;
    color: var(--_text2);
  }
  .night-summary b {
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .stat-value {
    margin-left: auto;
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .stat-pct {
    width: 30px;
    text-align: right;
    color: var(--_text2);
    font-variant-numeric: tabular-nums;
  }

  /* Sleeping heart rate */
  .section.heart {
    --tint: var(--_heart);
  }
  .hr-summary {
    color: var(--_text);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .hr-chart {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 6px;
  }
  .hr-yaxis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 112px;
    margin: -5px 0;
    font-size: 10px;
    line-height: 10px;
    text-align: right;
    color: var(--_text2);
    font-variant-numeric: tabular-nums;
  }
  .hr-plot {
    position: relative;
    height: 102px;
  }
  .hr-plot svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .hr-grid {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed var(--_divider);
  }
  .hr-line {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
  .hr-line.avg {
    stroke: var(--_heart);
    stroke-width: 2.5;
    filter: drop-shadow(0 0 var(--_glow) color-mix(in srgb, var(--_heart) 55%, transparent));
  }
  .hr-line.high {
    stroke: var(--_heart);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.55;
  }
  .hr-line.low {
    stroke: var(--_heart-low);
    stroke-width: 1;
    stroke-dasharray: 4 4;
    opacity: 0.8;
  }
  .hr-area {
    fill: color-mix(in srgb, var(--_heart) 18%, transparent);
    stroke: none;
  }
  /* Hover: one invisible column per hour, a guide line, dots and a floating box */
  .hr-hit {
    position: absolute;
    top: 0;
    bottom: 0;
    background: none;
    border: 0;
    padding: 0;
    cursor: crosshair;
  }
  .hr-hit:focus-visible {
    outline: 1px solid var(--_text2);
    outline-offset: -1px;
  }
  .hr-guide,
  .hr-dot,
  .hr-tip {
    position: absolute;
    pointer-events: none;
  }
  .hr-guide {
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--_text2);
    opacity: 0.45;
  }
  .hr-dot {
    width: 8px;
    height: 8px;
    margin: -4px 0 0 -4px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35);
  }
  .hr-dot.avg,
  .hr-dot.high {
    background: var(--_heart);
  }
  .hr-dot.low {
    background: var(--_heart-low);
  }
  /* The box floats over the chart, so showing it never moves the layout. */
  .hr-tip {
    top: 4px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 10px;
    padding: 6px 9px;
    border-radius: 8px;
    font-size: 11px;
    white-space: nowrap;
    color: #f4f1fa;
    background: rgba(18, 14, 28, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }
  .hr-tip.left {
    margin-left: -10px;
    transform: translateX(-100%);
  }
  .hr-tip b {
    font-weight: 600;
  }
  .hr-tip em {
    font-style: normal;
    opacity: 0.7;
  }
  .hr-tip span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .hr-tip u {
    margin-left: auto;
    padding-left: 12px;
    text-decoration: none;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .hr-tip i,
  .hr-legend i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--_heart);
  }
  .hr-tip .high i,
  .hr-legend .high i {
    opacity: 0.55;
  }
  .hr-tip .low i,
  .hr-legend .low i {
    background: var(--_heart-low);
  }
  .hr-xaxis {
    position: relative;
    grid-column: 2;
    height: 14px;
    margin-top: 3px;
    font-size: 10px;
    color: var(--_text2);
  }
  .hr-xaxis span {
    position: absolute;
    white-space: nowrap;
  }
  .hr-legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    margin-top: 6px;
    font-size: 11px;
    color: var(--_text2);
  }
  .hr-legend span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  /* Sections under the hero */
  .section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--_divider);
  }
  .section-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
    color: var(--_text2);
    margin-bottom: 8px;
  }
  .section-head span:first-child {
    font-weight: 600;
    color: var(--_text);
  }

  /* Hypnogram: four lanes, one rounded bar per stage stretch */
  .hypno {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
  }
  .lane-labels {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    color: var(--_text2);
  }
  .lane-labels span {
    height: var(--_lane);
    line-height: var(--_lane);
  }
  .plot {
    position: relative;
    height: calc(var(--_lane) * 4);
  }
  .lane-band {
    position: absolute;
    left: 0;
    right: 0;
    height: calc(var(--_lane) - 4px);
    margin-top: 2px;
    border-radius: 6px;
    background: color-mix(in srgb, currentColor 7%, transparent);
  }
  .tick {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--_divider);
  }
  .stage {
    position: absolute;
    height: 12px;
    min-width: 4px;
    border-radius: 6px;
    background: currentColor;
    box-shadow: 0 0 var(--_glow) currentColor;
  }
  .link {
    position: absolute;
    width: 1.5px;
    margin-left: -0.75px;
    opacity: 0.55;
  }
  .s-awake {
    color: var(--_awake);
  }
  .s-rem {
    color: var(--_rem);
  }
  .s-core {
    color: var(--_core);
  }
  .s-deep {
    color: var(--_deep);
  }
  .axis {
    position: relative;
    grid-column: 2;
    height: 16px;
    margin-top: 2px;
    font-size: 10px;
    color: var(--_text2);
  }
  .axis span {
    position: absolute;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  /* History: one bar per night, coloured by band */
  .history {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 64px;
  }
  .night-bar {
    flex: 1 1 0;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
  }
  .night-bar i {
    display: block;
    width: 100%;
    min-height: 3px;
    border-radius: 3px 3px 1px 1px;
    background: currentColor;
    opacity: 0.85;
  }
  .night-bar.estimated i {
    opacity: 0.45;
  }
  .night-bar.missing i {
    height: 3px;
    color: var(--_divider);
  }
  .night-bar.selected i,
  .night-bar:hover i {
    opacity: 1;
    box-shadow: 0 0 calc(var(--_glow) + 2px) currentColor;
  }
  .night-bar:focus-visible {
    outline: 2px solid var(--_text2);
    outline-offset: 1px;
    border-radius: 3px;
  }

  /* Tiles: every part in its own tinted, softly glowing box */
  .section.stages {
    --tint: var(--sr-stages-tint, var(--_core));
  }
  .section.nights {
    --tint: var(--sr-history-tint, var(--_bedtime));
  }
  /* Themed presets glow gently; a preset can turn it up with --sr-glow. */
  ha-card.tiles {
    --_glow: var(--sr-glow, 3px);
  }
  .tiles .rows {
    gap: 8px;
  }
  .tiles .row,
  .tiles .section {
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-border, 24%), transparent);
    background: color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-fill, 7%), transparent);
    box-shadow:
      0 0 16px color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-glow, 9%), transparent),
      inset 0 0 20px color-mix(in srgb, var(--tint, currentColor) var(--sr-tile-inset, 0%), transparent);
  }
  .tiles .section {
    margin-top: 12px;
  }
  .tiles .section-head span:first-child {
    color: color-mix(in srgb, var(--tint) var(--sr-title-tint, 0%), var(--_text));
  }
  .tiles .bar {
    margin-bottom: 5px;
  }
  .tiles .rings {
    isolation: isolate;
  }
  .tiles .rings::before {
    content: "";
    position: absolute;
    inset: -14px;
    z-index: -1;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--band, transparent) var(--sr-halo, 7%), transparent) 0%,
      transparent 68%
    );
    pointer-events: none;
  }
  .tiles .score {
    text-shadow: 0 0 12px color-mix(in srgb, var(--band, transparent) var(--sr-score-glow, 0%), transparent);
  }

  .message {
    font-size: 13px;
    color: var(--_text2);
    padding: 8px 0;
  }

  /* Two dashboard columns: hero on the left, stages and history on the right */
  @container (min-width: 640px) {
    .body.has-extras {
      display: grid;
      grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
      column-gap: 28px;
      align-items: center;
    }
    ha-card:not(.tiles) .extras > .section:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }
    .tiles .extras > .section:first-child {
      margin-top: 0;
    }
  }

  /* Between two and three columns the hero column is slim: rings above the rows */
  @container (min-width: 640px) and (max-width: 959px) {
    .has-extras .hero {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .has-extras .rings {
      align-self: center;
    }
  }

  /* Three columns: hero, stages and history side by side */
  @container (min-width: 960px) {
    .body.has-extras {
      grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    }
    /* Stages on the left, heart rate and history stacked on the right */
    .extras {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px 28px;
      align-items: stretch;
    }
    .extras.has-stages.has-hr > .section.stages {
      grid-row: span 2;
    }
    /* The stages panel is as tall as its two neighbours: fill it with bar rows. */
    .section.stages {
      display: flex;
      flex-direction: column;
    }
    .night-summary {
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--_divider);
    }
    .stage-stats {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      gap: 8px;
      margin-top: 10px;
      min-height: 120px;
    }
    .stat-bar,
    .stat.s-combo {
      display: flex;
    }
    .stat-bar {
      display: block;
    }
    .stat {
      gap: 10px;
    }
    .stat-name {
      width: 76px;
      flex: none;
    }
    .stat-value {
      margin-left: 0;
      width: 56px;
      text-align: right;
    }
    ha-card:not(.tiles) .extras > .section {
      margin-top: 0;
      padding-top: 0;
      border-top: 0;
    }
    .tiles .extras {
      column-gap: 12px;
    }
    .tiles .extras > .section {
      margin-top: 0;
    }
    .extras:not(.has-hr) .history {
      height: calc(var(--_lane) * 4);
    }
  }

  @container (max-width: 359px) {
    .hero {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }
    .rings {
      align-self: center;
    }
    .lane-labels {
      font-size: 10px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fill,
    .bar-fill {
      transition: none;
    }
  }
`;
