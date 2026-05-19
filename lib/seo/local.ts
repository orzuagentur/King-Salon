import { salonContact } from "@/lib/content/salon";
import { siteConfig } from "@/lib/seo/site";

export const localBusiness = {
  name: siteConfig.name,
  description:
    "Luxus-Barbershop und Hairstylist in Celle – Premium-Haarschnitte, Fades, Bartpflege und VIP-Grooming in der Hehlentorstraße.",
  streetAddress: salonContact.address.street,
  postalCode: "29221",
  addressLocality: "Celle",
  addressRegion: "Niedersachsen",
  addressCountry: "DE",
  geo: {
    latitude: 52.6228,
    longitude: 10.0674,
  },
  areaServed: [
    "Celle",
    "Garßen",
    "Wietze",
    "Hambühren",
    "Region Celle",
    "Niedersachsen",
  ],
  localKeywords: [
    "Barbershop Hehlentorstraße",
    "Friseur Celle Innenstadt",
    "Haarschnitt Celle Niedersachsen",
    "Herrensalon Celle",
    "King Salon Celle Termin",
  ],
  googleMapsUrl: salonContact.googleMapsUrl,
  phone: salonContact.phone,
  phoneDisplay: salonContact.phoneDisplay,
} as const;

export function getLocalGeoMetaTags() {
  const { latitude, longitude } = localBusiness.geo;

  return {
    "geo.region": "DE-NI",
    "geo.placename": localBusiness.addressLocality,
    "geo.position": `${latitude};${longitude}`,
    ICBM: `${latitude}, ${longitude}`,
  };
}

export function getFormattedLocalAddress() {
  return `${localBusiness.streetAddress}, ${localBusiness.postalCode} ${localBusiness.addressLocality}, ${localBusiness.addressCountry}`;
}
