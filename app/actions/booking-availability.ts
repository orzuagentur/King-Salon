"use server";

import { getDateAvailability } from "@/lib/booking/availability";
import type { DateAvailability } from "@/lib/booking/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function unavailableAvailability(dateIso: string, message: string): DateAvailability {
  return {
    availabilityByMaster: {},
    closed: true,
    closedMessage: message,
    date: dateIso,
    masters: [],
    slots: [],
  };
}

export async function fetchDateAvailability(dateIso: string) {
  if (!dateIso) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return unavailableAvailability(
      dateIso,
      "Terminbuchung ist vorübergehend nicht verfügbar (Server-Konfiguration). Bitte nutzen Sie WhatsApp.",
    );
  }

  try {
    return await getDateAvailability(dateIso);
  } catch {
    return unavailableAvailability(
      dateIso,
      "Verfügbarkeit konnte nicht geladen werden. Bitte später erneut versuchen oder per WhatsApp buchen.",
    );
  }
}
