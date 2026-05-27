import type { Metadata } from "next";

import { AiChatErrorBoundary } from "@/components/ai/AiChatErrorBoundary";
import { AiChatExperience } from "@/components/ai/AiChatExperience";
import { getAiAgentConfig } from "@/lib/data/ai-agent";
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
  const agent = await getAiAgentConfig();

  return (
    <AiChatErrorBoundary>
      <AiChatExperience agent={agent} />
    </AiChatErrorBoundary>
  );
}
