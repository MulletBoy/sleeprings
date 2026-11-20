import type {
  Band,
  HassEntity,
  HeartRateHour,
  HistoryNight,
  SleepData,
  StageSpan,
} from "./types";

export const BAND_LABELS: Record<Band, string> = {
  very_low: "Very Low",
  low: "Low",
  ok: "OK",
  high: "High",
  very_high: "Very High",
};

const BAND_KEYS = Object.keys(BAND_LABELS) as Band[];

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Band for a score (used for history bars, which only carry the score). */
export function bandFor(score: number): Band {
  if (score >= 96) return "very_high";
  if (score >= 81) return "high";
  if (score >= 61) return "ok";
  if (score >= 41) return "low";
  return "very_low";
}

export function readEntity(entity: HassEntity | undefined): SleepData {
  const a = entity?.attributes ?? {};
  const score = entity ? num(entity.state) : null;
  const bandAttr = String(a.band ?? "");
  const band = (BAND_KEYS as string[]).includes(bandAttr)
    ? (bandAttr as Band)
    : score !== null
      ? bandFor(score)
      : null;
  return {
    score,
    band,
    night: typeof a.night === "string" ? a.night : null,
    duration: num(a.duration_points),
    bedtime: num(a.bedtime_points),
    interruptions: num(a.interruptions_points),
    asleepMinutes: num(a.asleep_minutes),
    deviationMinutes: num(a.bedtime_deviation_minutes),
    wakeups: num(a.wakeups),
    awakeMinutes: num(a.awake_minutes),
    stages: Array.isArray(a.stages) ? (a.stages as StageSpan[]) : [],
    history: Array.isArray(a.history) ? (a.history as HistoryNight[]) : [],
    goalHours: num(a.duration_goal_hours),
    usualOnsetMinutes: num(a.usual_onset_minutes),
    heartRate: num(a.heart_rate_average),
    heartRateLow: num(a.heart_rate_lowest),
    heartRateHours: Array.isArray(a.heart_rate_hours) ? (a.heart_rate_hours as HeartRateHour[]) : [],
  };
}

/** 445 -> "7h 25m", 22 -> "22m". */
export function formatMinutes(minutes: number): string {
  const total = Math.round(Math.abs(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function durationText(d: SleepData): string {
  return d.asleepMinutes === null ? "" : `${formatMinutes(d.asleepMinutes)} asleep`;
}

export function bedtimeText(d: SleepData): string {
  if (d.bedtime === null) return "";
  if (d.deviationMinutes === null) return "No bedtime history yet";
  if (Math.abs(d.deviationMinutes) < 1) return "At your usual time";
  const direction = d.deviationMinutes > 0 ? "later" : "earlier";
  return `${formatMinutes(d.deviationMinutes)} ${direction} than usual`;
}

export function interruptionsText(d: SleepData): string {
  if (d.wakeups === null) return "";
  const awake = d.awakeMinutes === null ? "" : `, ${formatMinutes(d.awakeMinutes)} awake`;
  if (d.wakeups === 0) return `No wake-ups${awake}`;
  return `${d.wakeups} wake-up${d.wakeups === 1 ? "" : "s"}${awake}`;
}

/** "2030-03-10" as a local date (no timezone shift). */
export function parseNight(night: string): Date {
  const [y, m, d] = night.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function isoDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function formatNight(night: string, language?: string): string {
  return parseNight(night).toLocaleDateString(language, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(date: Date, language?: string, timeZone?: string): string {
  try {
    return date.toLocaleTimeString(language, { hour: "numeric", minute: "2-digit", timeZone });
  } catch {
    return date.toLocaleTimeString(language, { hour: "numeric", minute: "2-digit" });
  }
}

/** Points as Apple shows them: whole numbers. */
export function points(value: number | null): string {
  return value === null ? "--" : String(Math.round(value));
}

/** Minutes after noon (how bedtimes are stored) as a clock time, e.g. 690 -> "11:30 PM". */
export function formatClock(minutesAfterNoon: number, language?: string): string {
  const minutes = (((Math.round(minutesAfterNoon) + 720) % 1440) + 1440) % 1440;
  const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return date.toLocaleTimeString(language, { hour: "numeric", minute: "2-digit" });
}

/** Today's date (YYYY-MM-DD) in a time zone, or in the browser's if it is unknown. */
export function todayIn(timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return isoDate(new Date());
  }
}

/** Whole days between a night's wake date and today (0 = you woke up today). */
export function nightAge(night: string, today: string): number {
  return Math.round((parseNight(today).getTime() - parseNight(night).getTime()) / 86_400_000);
}
