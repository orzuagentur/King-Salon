import { BOOKING_SLOT_DURATION_MINUTES, DAY_NAME_TO_INDEX } from "@/lib/booking/constants";
import type { OpeningHoursEntry } from "@/lib/opening-hours/types";

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + (minutes ?? 0);
}

function formatMinutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function getOpeningHoursForDate(dateIso: string, openingHours: OpeningHoursEntry[]) {
  const date = new Date(`${dateIso}T12:00:00`);
  const dayIndex = date.getDay();

  return openingHours.find((entry) => DAY_NAME_TO_INDEX[entry.day] === dayIndex) ?? null;
}

export function generateTimeSlotsForDay(hoursLabel: string) {
  if (hoursLabel === "Geschlossen" || !hoursLabel.includes("-")) {
    return [];
  }

  const [openRaw, closeRaw] = hoursLabel.split("-").map((part) => part.trim());
  const openMinutes = parseTimeToMinutes(openRaw);
  const closeMinutes = parseTimeToMinutes(closeRaw);
  const lastStart = closeMinutes - BOOKING_SLOT_DURATION_MINUTES;

  if (lastStart < openMinutes) {
    return [];
  }

  const slots: string[] = [];

  for (let minute = openMinutes; minute <= lastStart; minute += BOOKING_SLOT_DURATION_MINUTES) {
    slots.push(formatMinutesToTime(minute));
  }

  return slots;
}

export function filterFutureSlots(dateIso: string, slots: string[]) {
  const todayIso = new Date().toISOString().slice(0, 10);

  if (dateIso !== todayIso) {
    return slots;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => parseTimeToMinutes(slot) > currentMinutes);
}

export function formatGermanDate(dateIso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
  }).format(new Date(`${dateIso}T12:00:00`));
}

export function formatGermanTime(time: string) {
  return time.slice(0, 5);
}
