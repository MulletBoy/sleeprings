export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

/** The small part of the Home Assistant frontend object this card uses. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language?: string; time_format?: string };
  config?: { time_zone?: string };
  callWS?: <T>(message: Record<string, unknown>) => Promise<T>;
}

export type RingStyle = "concentric" | "segmented";

export const COLOR_KEYS = [
  "duration",
  "bedtime",
  "interruptions",
  // Optional second colour of each ring: the ring fades from the first to this one.
  "duration_end",
  "bedtime_end",
  "interruptions_end",
  "very_low",
  "low",
  "ok",
  "high",
  "very_high",
  "awake",
  "rem",
  "core",
  "deep",
  "heart",
  "heart_low",
] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];
export type Colors = Partial<Record<ColorKey, string>>;

export interface SleepRingsCardConfig {
  type: string;
  entity?: string;
  name?: string;
  preset?: string;
  ring_style?: RingStyle;
  /** Keep the dashboard theme's card background even if the preset has its own. */
  theme_background?: boolean;
  /** Tinted, glowing boxes around each part. Defaults to the preset's choice. */
  tiles?: boolean;
  show_rows?: boolean;
  show_hypnogram?: boolean;
  show_history?: boolean;
  show_heart_rate?: boolean;
  /** History bars: stacked by part (default) or one bar coloured by band. */
  history_style?: "components" | "bands";
  /** Sleep goal shown on the Duration row, in hours. Default: the model's full-points duration. */
  sleep_goal_hours?: number;
  history_nights?: number;
  colors?: Colors;
}

export type Band = "very_low" | "low" | "ok" | "high" | "very_high";

export interface StageSpan {
  stage: string;
  start: string;
  end: string;
}

export interface HeartRateHour {
  start: string;
  mean: number;
  min?: number;
  max?: number;
  /** The hour is only partly inside the night. */
  partial?: boolean;
}

export interface HistoryNight {
  night: string;
  score: number;
  d?: number;
  b?: number;
  i?: number;
  /** No stage data for this night: the wake-up count is unknown. */
  estimated?: boolean;
}

/** What the card reads from the sleep score entity. */
export interface SleepData {
  score: number | null;
  band: Band | null;
  night: string | null;
  duration: number | null;
  bedtime: number | null;
  interruptions: number | null;
  asleepMinutes: number | null;
  deviationMinutes: number | null;
  wakeups: number | null;
  awakeMinutes: number | null;
  stages: StageSpan[];
  history: HistoryNight[];
  goalHours: number | null;
  usualOnsetMinutes: number | null;
  heartRate: number | null;
  heartRateLow: number | null;
  heartRateHours: HeartRateHour[];
}
