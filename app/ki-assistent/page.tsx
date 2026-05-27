import type { Metadata } from "next";

import { AiChatExperience } from "@/components/ai/AiChatExperience";
import { getHomepageContent } from "@/lib/data/homepage";
import { getActiveMasters } from "@/lib/data/masters";
import { getSalonContact } from "@/lib/data/settings";
import { createLocalPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalPageMetadata({
    title: "KI-Assistent & Terminbuchung | King Salon Celle",
    description:
      "King Salon KI-Assistent: Fragen zu Leistungen, Preisen und Öffnungszeiten — Termin direkt im Chat anfragen.",
    path: "/ki-assistent",
  });
}

export default async function KiAssistentPage() {
  const [contact, masters, homepage] = await Promise.all([
    getSalonContact(),
    getActiveMasters(),
    getHomepageContent(),
  ]);

  return (
    <AiChatExperience
      masters={masters}
      siteName={homepage.site_name}
      whatsappUrl={contact.whatsapp}
    />
  );
}
