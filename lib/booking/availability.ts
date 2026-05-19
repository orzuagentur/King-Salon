import { getBookingsForDate } from "@/lib/data/bookings";
import { getActiveMasters } from "@/lib/data/masters";
import { getOpeningHours } from "@/lib/data/opening-hours";
import {
  filterFutureSlots,
  generateTimeSlotsForDay,
  getOpeningHoursForDate,
} from "@/lib/booking/slots";
import type { DateAvailability } from "@/lib/booking/types";

function buildBookedMap(
  bookings: { master_id: string; appointment_time: string }[],
) {
  const map = new Map<string, Set<string>>();

  for (const booking of bookings) {
    const time = booking.appointment_time.slice(0, 5);
    const existing = map.get(booking.master_id) ?? new Set<string>();
    existing.add(time);
    map.set(booking.master_id, existing);
  }

  return map;
}

export async function getDateAvailability(dateIso: string): Promise<DateAvailability> {
  const masters = await getActiveMasters();
  const openingHours = await getOpeningHours();
  const dayHours = getOpeningHoursForDate(dateIso, openingHours);

  if (!dayHours || dayHours.hours === "Geschlossen") {
    return {
      availabilityByMaster: {},
      closed: true,
      closedMessage: "An diesem Tag ist der Salon geschlossen.",
      date: dateIso,
      masters,
      slots: [],
    };
  }

  const allSlots = filterFutureSlots(dateIso, generateTimeSlotsForDay(dayHours.hours));
  const bookings = await getBookingsForDate(dateIso);
  const bookedMap = buildBookedMap(bookings);

  const availabilityByMaster: Record<string, string[]> = {};

  for (const master of masters) {
    const bookedTimes = bookedMap.get(master.id) ?? new Set<string>();
    availabilityByMaster[master.id] = allSlots.filter((slot) => !bookedTimes.has(slot));
  }

  const unionAvailable = new Set<string>();

  for (const slots of Object.values(availabilityByMaster)) {
    for (const slot of slots) {
      unionAvailable.add(slot);
    }
  }

  return {
    availabilityByMaster,
    closed: false,
    closedMessage: "",
    date: dateIso,
    masters,
    slots: allSlots.filter((slot) => unionAvailable.has(slot)).sort(),
  };
}

export function getAvailableMastersForSlot(
  availability: DateAvailability,
  time: string,
) {
  if (!time) {
    return [];
  }

  return availability.masters.filter((master) =>
    availability.availabilityByMaster[master.id]?.includes(time),
  );
}

export function resolveMasterForBooking(
  availability: DateAvailability,
  time: string,
  preferredMasterId: string,
): {
  error: string | null;
  masterId: string | null;
  suggestedMasterIds?: string[];
} {
  const available = getAvailableMastersForSlot(availability, time);

  if (available.length === 0) {
    return {
      error:
        "Dieser Termin ist leider ausgebucht. Bitte wählen Sie eine andere Uhrzeit oder einen anderen Meister.",
      masterId: null,
    };
  }

  if (preferredMasterId) {
    const preferred = available.find((master) => master.id === preferredMasterId);

    if (!preferred) {
      const names = available.map((master) => master.name).join(", ");

      return {
        error: `Dieser Termin ist für den gewählten Meister bereits belegt. Verfügbar: ${names}`,
        masterId: null,
        suggestedMasterIds: available.map((master) => master.id),
      };
    }

    return { error: null, masterId: preferred.id };
  }

  return { error: null, masterId: available[0].id };
}
