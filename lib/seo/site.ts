import { salonContact } from "@/lib/content/salon";

export const siteConfig = {
  name: "King Salon Celle",
  shortName: "King Salon",
  description:
    "King Salon Celle bietet Premium-Haarschnitte, Fades, Bartpflege und VIP-Grooming in dunkler Luxury-Atmosphäre.",
  locale: "de_DE",
  language: "de",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kingsalon-celle.de",
  ogImage: "/images/salon-aussenansicht.png",
  ogImageAlt: "King Salon Celle – Luxus-Barbershop in der Hehlentorstraße",
  keywords: [
    "Barbershop Celle",
    "Friseur Celle",
    "Haarschnitt Celle",
    "Fade Celle",
    "Bartpflege Celle",
    "King Salon",
    "Luxus Barbershop",
    "Herrenfriseur Celle",
  ],
  address: {
    street: salonContact.address.street,
    city: salonContact.address.city,
    country: salonContact.address.country,
  },
  phone: salonContact.phoneDisplay,
  instagram: salonContact.instagram,
  googleMaps: salonContact.googleMapsUrl,
} as const;
