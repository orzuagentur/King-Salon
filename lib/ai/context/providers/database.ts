import { CONTEXT_PRIORITY, type ContextSection } from "@/lib/ai/context/types";
import { getActiveAiFaqKnowledge } from "@/lib/data/ai-knowledge";
import { getBookingContextStats } from "@/lib/data/bookings";
import { getActiveMasters } from "@/lib/data/masters";
import { getActiveReviews } from "@/lib/data/reviews";
import { getOpeningHours } from "@/lib/data/opening-hours";
import { getActiveServicesForContext } from "@/lib/data/services";
import { getSalonContact } from "@/lib/data/settings";
import { formatPriceLabel } from "@/lib/format/price";
import { siteConfig } from "@/lib/seo/site";

export async function buildDatabaseContext(): Promise<ContextSection> {
  const [contact, services, openingHours, masters, reviews, bookingStats, faqEntries] = await Promise.all([
    getSalonContact(),
    getActiveServicesForContext(),
    getOpeningHours(),
    getActiveMasters(),
    getActiveReviews(),
    getBookingContextStats(),
    getActiveAiFaqKnowledge(),
  ]);

  const servicesBlock =
    services.length > 0
      ? services
          .map(
            (service) =>
              `- ${service.title}: ${service.description} (${formatPriceLabel(Number(service.price))}${service.duration ? `, ${service.duration}` : ""})`,
          )
          .join("\n")
      : "- Keine aktiven Leistungen.";

  const hoursBlock = openingHours.map((entry) => `- ${entry.day}: ${entry.hours}`).join("\n");

  const mastersBlock =
    masters.length > 0
      ? masters
          .map((master) => `- ${master.name}${master.title ? ` (${master.title})` : ""}`)
          .join("\n")
      : "- Keine Meister eingetragen.";

  const reviewsBlock =
    reviews.length > 0
      ? reviews
          .slice(0, 6)
          .map((review) => `- ${review.name} (${review.rating}/5): „${review.text}"`)
          .join("\n")
      : "- Keine Bewertungen verfügbar.";

  const faqBlock =
    faqEntries.length > 0
      ? faqEntries
          .slice(0, 6)
          .map((entry) => `- ${entry.title}: ${entry.content}`)
          .join("\n")
      : "- Keine FAQ-Einträge in der Datenbank.";

  const bookingLoadBlock = `
- Nächste 7 Tage (nur aggregiert): ${bookingStats.nextSevenDays.total} Buchungen
- Davon bestätigt: ${bookingStats.nextSevenDays.confirmed}
- Davon ausstehend: ${bookingStats.nextSevenDays.pending}
- Keine Kundendaten (Name, Telefon, E-Mail) ausgeben
`.trim();

  const content = `
SALON: ${siteConfig.name}

KONTAKT:
- Adresse: ${contact.address.street}, ${contact.address.city}, ${contact.address.country}
- Telefon: ${contact.phoneDisplay}
- Instagram: ${contact.instagram}
- WhatsApp: ${contact.whatsapp}
- Google Maps: ${contact.googleMapsUrl}

ÖFFNUNGSZEITEN:
${hoursBlock}

LEISTUNGEN & PREISE:
${servicesBlock}

MEISTER / TEAM:
${mastersBlock}

KUNDENBEWERTUNGEN (Auszug):
${reviewsBlock}

FAQ AUS DATENBANK (Auszug):
${faqBlock}

BUCHUNGS-AUSLASTUNG (SICHER GEFILTERT):
${bookingLoadBlock}

TERMINE & BUCHUNG:
- Online-Terminanfrage über „Termin anfragen“ auf der Website
- Keine verbindliche Bestätigung im Chat — Formular, Telefon oder WhatsApp empfehlen
`.trim();

  return {
    priority: CONTEXT_PRIORITY.database,
    title: "Live-Datenbank",
    content,
  };
}
