import { openingHours } from "@/lib/content/salon";

import type { OpeningHoursEntry } from "@/lib/opening-hours/types";

export const defaultOpeningHours: OpeningHoursEntry[] = openingHours.map((entry) => ({
  day: entry.day,
  hours: entry.hours,
}));

export const weekDays = defaultOpeningHours.map((entry) => entry.day);
