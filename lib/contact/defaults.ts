import { salonContact } from "@/lib/content/salon";

import type { SalonContact } from "@/lib/contact/types";

export const defaultSalonContact: SalonContact = {
  address: { ...salonContact.address },
  email: null,
  facebook: salonContact.facebook,
  googleMapsEmbedUrl: salonContact.googleMapsEmbedUrl,
  googleMapsUrl: salonContact.googleMapsUrl,
  instagram: salonContact.instagram,
  phone: salonContact.phone,
  phoneDisplay: salonContact.phoneDisplay,
  whatsapp: salonContact.whatsapp,
};
