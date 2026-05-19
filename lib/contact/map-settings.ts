import { defaultSalonContact } from "@/lib/contact/defaults";
import {
  buildGoogleMapsEmbedUrl,
  normalizePhoneTel,
  parseAddress,
} from "@/lib/contact/parse";
import type { SalonContact } from "@/lib/contact/types";
import type { Database } from "@/types/database";

type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];

export function mapSettingsToContact(settings: SettingsRow): SalonContact {
  const address = parseAddress(settings.address);

  return {
    address,
    email: settings.email,
    facebook: settings.facebook ?? defaultSalonContact.facebook,
    googleMapsEmbedUrl: buildGoogleMapsEmbedUrl(settings.address),
    googleMapsUrl: settings.google_maps_url ?? defaultSalonContact.googleMapsUrl,
    instagram: settings.instagram ?? defaultSalonContact.instagram,
    phone: normalizePhoneTel(settings.phone),
    phoneDisplay: settings.phone,
    whatsapp: settings.whatsapp ?? defaultSalonContact.whatsapp,
  };
}
