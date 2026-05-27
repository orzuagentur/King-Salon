import type { SalonAddress } from "@/lib/contact/types";

export function parseAddress(address: string): SalonAddress {
  const parts = address.split(",").map((part) => part.trim());

  return {
    street: parts[0] ?? address,
    city: parts[1] ?? "",
    country: parts[2] ?? "Deutschland",
  };
}

export function buildGoogleMapsEmbedUrl(address: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=de&z=16&output=embed`;
}

export function normalizePhoneTel(phone: string) {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  if (cleaned.startsWith("00")) {
    return `+${cleaned.slice(2)}`;
  }

  if (cleaned.startsWith("0")) {
    return `+49${cleaned.slice(1)}`;
  }

  return `+${cleaned}`;
}

export function getInstagramDisplay(instagramUrl: string) {
  const match = instagramUrl.match(/instagram\.com\/([^/?]+)/i);

  if (match?.[1]) {
    return `@${match[1]}`;
  }

  return "Instagram";
}

export function getFacebookDisplay(siteName: string) {
  return siteName;
}
