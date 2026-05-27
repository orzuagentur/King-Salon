import "server-only";

import type { AiBookingDraft, AiBookingStep, AiBookingValidateResult } from "@/lib/ai/booking/types";
import { getAvailableMastersForSlot, getDateAvailability } from "@/lib/booking/availability";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function validateBookingDraftStep(
  step: AiBookingStep,
  draft: AiBookingDraft,
): Promise<AiBookingValidateResult> {
  if (step === "date") {
    const date = draft.appointment_date;

    if (!date) {
      return { ok: false, error: "Bitte nennen Sie ein Datum (z. B. morgen oder 15.06.2026)." };
    }

    if (date < todayIso()) {
      return { ok: false, error: "Bitte wählen Sie ein zukünftiges Datum." };
    }

    const availability = await getDateAvailability(date);

    if (availability.closed || availability.slots.length === 0) {
      return {
        ok: false,
        error: availability.closedMessage || "An diesem Tag sind keine Termine frei.",
        availability,
      };
    }

    return {
      ok: true,
      nextStep: "time",
      availability,
      slots: availability.slots,
    };
  }

  if (step === "time") {
    const date = draft.appointment_date;
    const time = draft.appointment_time;

    if (!date) {
      return { ok: false, error: "Zuerst bitte ein Datum wählen.", nextStep: "date" };
    }

    if (!time) {
      return { ok: false, error: "Bitte nennen Sie eine Uhrzeit (z. B. 14:30)." };
    }

    const availability = await getDateAvailability(date);

    if (!availability.slots.includes(time)) {
      return {
        ok: false,
        error: `Die Uhrzeit ${time} ist nicht verfügbar. Frei: ${availability.slots.join(", ")}`,
        availability,
        slots: availability.slots,
      };
    }

    const masters = getAvailableMastersForSlot(availability, time);

    if (masters.length === 0) {
      return {
        ok: false,
        error: "Zu dieser Uhrzeit ist leider kein Meister frei. Bitte andere Uhrzeit wählen.",
        availability,
        slots: availability.slots,
      };
    }

    return {
      ok: true,
      nextStep: masters.length === 1 ? "name" : "master",
      availability,
      masters,
      slots: availability.slots,
    };
  }

  if (step === "master") {
    const date = draft.appointment_date;
    const time = draft.appointment_time;
    const masterId = draft.master_id;

    if (!date || !time) {
      return { ok: false, error: "Zuerst Datum und Uhrzeit festlegen.", nextStep: "date" };
    }

    if (!masterId) {
      const availability = await getDateAvailability(date);
      const masters = getAvailableMastersForSlot(availability, time);

      return {
        ok: false,
        error: `Bitte Meister wählen. Verfügbar um ${time}: ${masters.map((m) => m.name).join(", ")}`,
        availability,
        masters,
      };
    }

    const availability = await getDateAvailability(date);
    const masters = getAvailableMastersForSlot(availability, time);
    const selected = masters.find((master) => master.id === masterId);

    if (!selected) {
      return {
        ok: false,
        error: `Dieser Meister ist um ${time} nicht frei. Verfügbar: ${masters.map((m) => m.name).join(", ")}`,
        availability,
        masters,
      };
    }

    return { ok: true, nextStep: "name", availability, masters };
  }

  if (step === "name") {
    const name = draft.customer_name?.trim();

    if (!name || name.length < 2) {
      return { ok: false, error: "Bitte Ihren vollständigen Namen angeben." };
    }

    return { ok: true, nextStep: "phone" };
  }

  if (step === "phone") {
    const phone = draft.customer_phone?.trim();

    if (!phone || phone.length < 6) {
      return { ok: false, error: "Bitte eine gültige Telefonnummer angeben." };
    }

    return { ok: true, nextStep: "email" };
  }

  if (step === "email") {
    const email = draft.customer_email?.trim();

    if (!email || !email.includes("@")) {
      return { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." };
    }

    return { ok: true, nextStep: "confirm" };
  }

  if (step === "confirm") {
    const date = draft.appointment_date;
    const time = draft.appointment_time;

    if (!date || !time || !draft.master_id || !draft.customer_name || !draft.customer_phone || !draft.customer_email) {
      return { ok: false, error: "Es fehlen noch Angaben für die Buchung." };
    }

    const availability = await getDateAvailability(date);

    if (!availability.slots.includes(time)) {
      return {
        ok: false,
        error: "Der Termin ist inzwischen belegt. Bitte andere Uhrzeit wählen.",
        nextStep: "time",
        availability,
        slots: availability.slots,
      };
    }

    const masters = getAvailableMastersForSlot(availability, time);

    if (!masters.some((master) => master.id === draft.master_id)) {
      return {
        ok: false,
        error: "Der Meister ist zu dieser Zeit nicht mehr frei.",
        nextStep: "master",
        availability,
        masters,
      };
    }

    return { ok: true, nextStep: "done", availability, masters };
  }

  return { ok: true, nextStep: "done" };
}
