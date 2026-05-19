import { defaultOpeningHours, weekDays } from "@/lib/opening-hours/defaults";
import type { OpeningHoursEntry } from "@/lib/opening-hours/types";
import type { Json } from "@/types/database";

function isOpeningHoursEntry(value: unknown): value is OpeningHoursEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "day" in value &&
    "hours" in value &&
    typeof (value as OpeningHoursEntry).day === "string" &&
    typeof (value as OpeningHoursEntry).hours === "string"
  );
}

export function parseOpeningHoursJson(json: Json | null | undefined): OpeningHoursEntry[] {
  if (!Array.isArray(json)) {
    return defaultOpeningHours;
  }

  const entries = json.filter(isOpeningHoursEntry);

  if (entries.length === 0) {
    return defaultOpeningHours;
  }

  const byDay = new Map(entries.map((entry) => [entry.day, entry.hours]));

  return weekDays.map((day) => ({
    day,
    hours: byDay.get(day) ?? defaultOpeningHours.find((entry) => entry.day === day)?.hours ?? "Geschlossen",
  }));
}
