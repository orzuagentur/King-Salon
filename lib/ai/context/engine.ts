import {
  getCachedSystemInstruction,
  setCachedSystemInstruction,
} from "@/lib/ai/context/cache";
import { AI_CHAT_LIMITS } from "@/lib/ai/config";
import { buildDatabaseContext } from "@/lib/ai/context/providers/database";
import { buildDefaultBehaviorContext } from "@/lib/ai/context/providers/default-behavior";
import { buildKnowledgeBaseContext } from "@/lib/ai/context/providers/knowledge-base";
import { buildSiteContentContext } from "@/lib/ai/context/providers/site-content";
import type { ContextSection } from "@/lib/ai/context/types";
import type { ChatApiMessage } from "@/lib/ai/validation";

type ContextIntent = "booking" | "contact" | "services" | "reviews" | "general";

export async function buildContextSections(): Promise<ContextSection[]> {
  const [knowledgeBase, database, siteContent, defaultBehavior] = await Promise.all([
    buildKnowledgeBaseContext(),
    buildDatabaseContext(),
    buildSiteContentContext(),
    buildDefaultBehaviorContext(),
  ]);

  const sections: ContextSection[] = [database, siteContent, defaultBehavior];

  if (knowledgeBase) {
    sections.unshift(knowledgeBase);
  }

  return sections.sort((a, b) => a.priority - b.priority);
}

function formatSectionsForPrompt(sections: ContextSection[]) {
  return sections
    .map((section) => `### ${section.title}\n${section.content}`)
    .join("\n\n");
}

function detectIntentFromMessages(messages: ChatApiMessage[]): ContextIntent {
  const lastUserText = [...messages]
    .reverse()
    .find((message) => message.role === "user")
    ?.content.toLowerCase();

  if (!lastUserText) {
    return "general";
  }

  if (/(termin|buchen|frei|uhr|slot|datum|verf(ü|u)gbar|wann)/.test(lastUserText)) {
    return "booking";
  }

  if (/(preis|preise|kosten|leistung|haarschnitt|fade|bart|service)/.test(lastUserText)) {
    return "services";
  }

  if (/(telefon|whatsapp|adresse|kontakt|standort|maps|email|instagram)/.test(lastUserText)) {
    return "contact";
  }

  if (/(bewertung|rezension|erfahrung|kundenmeinung|sterne)/.test(lastUserText)) {
    return "reviews";
  }

  return "general";
}

function pickSectionsForIntent(sections: ContextSection[], intent: ContextIntent) {
  const alwaysKeep = sections.filter(
    (section) => section.title === "Standard-Verhalten" || section.title === "Wissensdatenbank (Admin)",
  );

  const databaseSection = sections.find((section) => section.title === "Live-Datenbank");
  const siteSection = sections.find((section) => section.title === "Website-Inhalte");

  if (!databaseSection && !siteSection) {
    return sections;
  }

  if (intent === "general") {
    return sections;
  }

  const picked: ContextSection[] = [...alwaysKeep];
  if (databaseSection) {
    picked.push(databaseSection);
  }

  // Keep site content only when useful to avoid token overhead.
  if (siteSection && intent === "services") {
    picked.push(siteSection);
  }

  return picked.sort((a, b) => a.priority - b.priority);
}

function capInstructionSize(instruction: string) {
  if (instruction.length <= AI_CHAT_LIMITS.maxSystemInstructionChars) {
    return instruction;
  }

  return `${instruction.slice(0, AI_CHAT_LIMITS.maxSystemInstructionChars)}\n\n[Kontext gekürzt für schnelle Antwort.]`;
}

export async function buildAiSystemInstruction(options?: {
  skipCache?: boolean;
  messages?: ChatApiMessage[];
}) {
  const canUseCache = !options?.skipCache && !options?.messages?.length;
  if (canUseCache) {
    const cached = getCachedSystemInstruction();

    if (cached) {
      return cached;
    }
  }

  const sections = await buildContextSections();
  const intent = options?.messages ? detectIntentFromMessages(options.messages) : "general";
  const selectedSections = pickSectionsForIntent(sections, intent);
  const instruction = `
Du unterstützt Kunden von King Salon Celle als offizieller Website-Assistent.

KONTEXT-PRIORITÄT (wichtig → weniger wichtig):
1. Wissensdatenbank aus der Admin-Panel
2. Live-Daten aus der Datenbank (Leistungen, Preise, Team, Kontakt)
3. Inhalte der Website
4. Standard-Verhalten und Admin-Prompt-Einstellungen

${formatSectionsForPrompt(selectedSections)}
`.trim();
  const optimizedInstruction = capInstructionSize(instruction);

  if (canUseCache) {
    setCachedSystemInstruction(optimizedInstruction);
  }

  return optimizedInstruction;
}

export async function getContextPreview() {
  const sections = await buildContextSections();

  return {
    sections,
    instruction: await buildAiSystemInstruction({ skipCache: true }),
  };
}
