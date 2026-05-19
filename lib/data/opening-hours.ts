import { defaultOpeningHours } from "@/lib/opening-hours/defaults";
import { parseOpeningHoursJson } from "@/lib/opening-hours/parse";
import type { OpeningHoursEntry } from "@/lib/opening-hours/types";
import { getSettings } from "@/lib/data/settings";

export async function getOpeningHours(): Promise<OpeningHoursEntry[]> {
  const settings = await getSettings();

  if (!settings) {
    return defaultOpeningHours;
  }

  return parseOpeningHoursJson(settings.opening_hours);
}
