import { formatGermanDate, formatGermanTime } from "@/lib/booking/slots";

export type BookingRequest = {
  email: string;
  masterName: string;
  message: string;
  name: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatBookingTelegramMessage(booking: BookingRequest) {
  return [
    "🆕 <b>Neue Terminanfrage – King Salon Celle</b>",
    "",
    `📅 <b>Datum:</b> ${escapeHtml(formatGermanDate(booking.appointmentDate))}`,
    `🕐 <b>Uhrzeit:</b> ${escapeHtml(formatGermanTime(booking.appointmentTime))}`,
    `✂️ <b>Meister:</b> ${escapeHtml(booking.masterName)}`,
    "",
    `👤 <b>Name:</b> ${escapeHtml(booking.name)}`,
    `📞 <b>Telefon:</b> ${escapeHtml(booking.phone)}`,
    `✉️ <b>E-Mail:</b> ${escapeHtml(booking.email)}`,
    "",
    "💬 <b>Nachricht:</b>",
    escapeHtml(booking.message || "—"),
  ].join("\n");
}
