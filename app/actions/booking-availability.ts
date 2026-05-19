"use server";

import { getDateAvailability } from "@/lib/booking/availability";

export async function fetchDateAvailability(dateIso: string) {
  if (!dateIso) {
    return null;
  }

  return getDateAvailability(dateIso);
}
