"use server";

import {
  getDateAvailability,
  resolveMasterForBooking,
} from "@/lib/booking/availability";
import type { BookingPayload } from "@/lib/booking/types";
import { getActiveMasters } from "@/lib/data/masters";
import { formatBookingTelegramMessage } from "@/lib/telegram/format";
import { sendTelegramMessage } from "@/lib/telegram/send-message";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type BookingActionState = {
  error: string;
  success: boolean;
  suggestedMasterId?: string;
};

export const initialBookingState: BookingActionState = {
  error: "",
  success: false,
};

function getTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function buildBookingFromFormData(formData: FormData): BookingPayload {
  return {
    customer_name: getTextField(formData, "name"),
    customer_phone: getTextField(formData, "phone"),
    customer_email: getTextField(formData, "email"),
    message: getTextField(formData, "message"),
    appointment_date: getTextField(formData, "appointment_date"),
    appointment_time: getTextField(formData, "appointment_time"),
    master_id: getTextField(formData, "master_id"),
  };
}

function validateBooking(payload: BookingPayload): string | null {
  if (!payload.customer_name || payload.customer_name.length < 2) {
    return "Bitte geben Sie Ihren Namen ein.";
  }

  if (!payload.customer_phone || payload.customer_phone.length < 6) {
    return "Bitte geben Sie eine gültige Telefonnummer ein.";
  }

  if (!payload.customer_email || !payload.customer_email.includes("@")) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
  }

  if (!payload.appointment_date) {
    return "Bitte wählen Sie ein Datum.";
  }

  if (!payload.appointment_time) {
    return "Bitte wählen Sie eine Uhrzeit.";
  }

  if (payload.message.length > 2000) {
    return "Die Nachricht ist zu lang.";
  }

  const today = new Date().toISOString().slice(0, 10);

  if (payload.appointment_date < today) {
    return "Bitte wählen Sie ein zukünftiges Datum.";
  }

  return null;
}

export async function submitBookingRequest(
  _prevState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const honeypot = getTextField(formData, "website");

  if (honeypot) {
    return { success: true, error: "" };
  }

  const booking = buildBookingFromFormData(formData);
  const validationError = validateBooking(booking);

  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const availability = await getDateAvailability(booking.appointment_date);

    if (availability.closed) {
      return { success: false, error: availability.closedMessage };
    }

    if (!availability.slots.includes(booking.appointment_time)) {
      return {
        success: false,
        error: "Diese Uhrzeit ist nicht verfügbar. Bitte wählen Sie einen anderen Termin.",
      };
    }

    const resolution = resolveMasterForBooking(
      availability,
      booking.appointment_time,
      booking.master_id,
    );

    if (!resolution.masterId) {
      return {
        success: false,
        error: resolution.error ?? "Termin nicht verfügbar.",
        suggestedMasterId: resolution.suggestedMasterIds?.[0],
      };
    }

    const masters = await getActiveMasters();
    const master = masters.find((item) => item.id === resolution.masterId);

    if (!master) {
      return { success: false, error: "Meister nicht gefunden." };
    }

    const supabase = await createSupabaseServerClient();
    const { error: insertError } = await supabase.from("bookings").insert({
      master_id: resolution.masterId,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      customer_email: booking.customer_email,
      message: booking.message || null,
      appointment_date: booking.appointment_date,
      appointment_time: `${booking.appointment_time}:00`,
      status: "pending",
    });

    if (insertError) {
      console.error("Booking insert failed", insertError);

      if (insertError.code === "23505") {
        return {
          success: false,
          error:
            "Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Uhrzeit oder einen anderen Meister.",
        };
      }

      return {
        success: false,
        error:
          "Die Buchung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut oder buchen Sie per WhatsApp.",
      };
    }

    const telegramMessage = formatBookingTelegramMessage({
      name: booking.customer_name,
      phone: booking.customer_phone,
      email: booking.customer_email,
      message: booking.message,
      appointmentDate: booking.appointment_date,
      appointmentTime: booking.appointment_time,
      masterName: master.name,
    });

    const telegramResult = await sendTelegramMessage(telegramMessage);

    if (!telegramResult.success) {
      console.error("Telegram notification failed", telegramResult.error);
    }

    return { success: true, error: "" };
  } catch (error) {
    console.error("Booking request failed", error);

    return {
      success: false,
      error:
        "Die Buchung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut oder buchen Sie per WhatsApp.",
    };
  }
}
