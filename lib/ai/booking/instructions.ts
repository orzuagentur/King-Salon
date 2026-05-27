import type { AiBookingDraft, AiBookingStep } from "@/lib/ai/booking/types";

const STEP_LABELS: Record<AiBookingStep, string> = {
  date: "Datum",
  time: "Uhrzeit",
  master: "Meister",
  name: "Name",
  phone: "Telefon",
  email: "E-Mail",
  confirm: "Bestätigung",
  done: "Abgeschlossen",
};

export function buildAiBookingInstructions(
  step: AiBookingStep,
  draft: AiBookingDraft,
) {
  const draftSummary = [
    draft.appointment_date ? `Datum: ${draft.appointment_date}` : null,
    draft.appointment_time ? `Uhrzeit: ${draft.appointment_time}` : null,
    draft.master_id ? `Meister-ID: ${draft.master_id}` : null,
    draft.customer_name ? `Name: ${draft.customer_name}` : null,
    draft.customer_phone ? `Telefon: ${draft.customer_phone}` : null,
    draft.customer_email ? `E-Mail: ${draft.customer_email}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return `
TERMINBUCHUNG IM CHAT (AKTIV):
Aktueller Schritt: ${STEP_LABELS[step]}
Bereits erfasst: ${draftSummary || "noch nichts"}

STRIKTE REGELN:
1. Führe den Gast Schritt für Schritt durch: Datum → Uhrzeit → Meister → Name → Telefon → E-Mail → Bestätigung.
2. Nenne NUR Uhrzeiten und Meister aus dem Block „LIVE-TERMINVERFÜGBARKEIT“. Belegte Zeiten NIEMALS als frei nennen.
3. Wenn ein Wunschtermin belegt ist: ehrlich ablehnen und nur echte Alternativen aus der Liste anbieten.
4. Pro Antwort maximal eine Frage stellen (den aktuellen Schritt).
5. Kurz, höflich, premium — keine langen Textwände.
6. Bei Schritt „confirm“: alle Daten zusammenfassen und um Bestätigung bitten.
7. Keine verbindliche Zusage — es ist eine Terminanfrage, wir melden uns zur Bestätigung.

Schritt-Hinweise:
- date: Nach Wunschdatum fragen (auch „heute“, „morgen“ verstehen).
- time: Nur freie Slots des gewählten Datums nennen.
- master: Nur Meister nennen, die zur gewählten Uhrzeit laut Liste frei sind.
- name/phone/email: jeweils ein Feld erfragen.
- confirm: Zusammenfassung + Bestätigung erfragen.
`.trim();
}
