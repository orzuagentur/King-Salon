import { getDateAvailability } from "@/lib/booking/availability";
import { formatGermanDate } from "@/lib/booking/slots";

const SNAPSHOT_DAYS = 10;

function addDaysIso(baseIso: string, days: number) {
  const date = new Date(`${baseIso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export async function buildBookingAvailabilitySnapshot() {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    "LIVE-TERMINVERFÜGBARKEIT (nur diese Zeiten sind frei — niemals andere nennen):",
  ];

  for (let offset = 0; offset < SNAPSHOT_DAYS; offset += 1) {
    const dateIso = addDaysIso(today, offset);
    const availability = await getDateAvailability(dateIso);
    const label = formatGermanDate(dateIso);

    if (availability.closed || availability.slots.length === 0) {
      lines.push(`- ${dateIso} (${label}): GESCHLOSSEN / keine freien Slots`);
      continue;
    }

    const masterLines = availability.masters.map((master) => {
      const slots = availability.availabilityByMaster[master.id] ?? [];

      if (slots.length === 0) {
        return `    • ${master.name}: ausgebucht`;
      }

      return `    • ${master.name}: ${slots.join(", ")}`;
    });

    lines.push(
      `- ${dateIso} (${label}): freie Zeiten gesamt: ${availability.slots.join(", ")}`,
      ...masterLines,
    );
  }

  return lines.join("\n");
}
