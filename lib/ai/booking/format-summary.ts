import type { AiBookingDraft } from "@/lib/ai/booking/types";
import { formatGermanDate } from "@/lib/booking/slots";

export function formatBookingSummary(draft: AiBookingDraft, masterName: string) {
  const dateLabel = draft.appointment_date ? formatGermanDate(draft.appointment_date) : "—";

  return [
    `Datum: ${dateLabel}`,
    `Uhrzeit: ${draft.appointment_time ?? "—"}`,
    `Meister: ${masterName}`,
    `Name: ${draft.customer_name ?? "—"}`,
    `Telefon: ${draft.customer_phone ?? "—"}`,
    `E-Mail: ${draft.customer_email ?? "—"}`,
  ].join("\n");
}
