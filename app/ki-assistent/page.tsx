import type { Metadata } from "next";

import { AiChatErrorBoundary } from "@/components/ai/AiChatErrorBoundary";
import { AiChatExperience } from "@/components/ai/AiChatExperience";
import { getAiAgentConfig } from "@/lib/data/ai-agent";
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
  const [contact, masters, agent] = await Promise.all([
    getSalonContact(),
    getActiveMasters(),
    getAiAgentConfig(),
  ]);

  return (
    <AiChatErrorBoundary>
      <AiChatExperience agent={agent} masters={masters} whatsappUrl={contact.whatsapp} />
    </AiChatErrorBoundary>
  );
}
