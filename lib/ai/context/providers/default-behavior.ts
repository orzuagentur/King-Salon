import { CONTEXT_PRIORITY, type ContextSection } from "@/lib/ai/context/types";
import { getAiSettings } from "@/lib/data/ai-settings";
import { siteConfig } from "@/lib/seo/site";

const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch",
  tr: "Türkisch",
  ar: "Arabisch",
};

const BASE_RULES = `
STANDARD-VERHALTEN:
- Antworte höflich und im Premium-Ton von King Salon.
- Kurz und präzise (2–6 Sätze), außer mehr Detail wird benötigt.
- Nutze zuerst Wissensdatenbank, dann Live-Daten, dann Website-Inhalte.
- Erfinde keine Preise, Zeiten oder Leistungen.
- Bei fehlenden Infos ehrlich bleiben und auf Telefon, WhatsApp oder Termin-Formular verweisen.
- Keine medizinischen oder rechtlichen Ratschläge.
- Keine Speicherung persönlicher Kundendaten im Chat.
`.trim();

export async function buildDefaultBehaviorContext(): Promise<ContextSection> {
  const settings = await getAiSettings();

  const languageCode = settings?.language?.trim() || "de";
  const languageLabel = LANGUAGE_LABELS[languageCode] ?? languageCode;

  const parts = [
    `Du bist der offizielle KI-Assistent von ${siteConfig.name} in Celle, Deutschland.`,
    `SPRACHE: Antworte ausschließlich auf ${languageLabel} (Code: ${languageCode}).`,
    BASE_RULES,
  ];

  if (settings?.tone) {
    parts.push(`TON & STIL: ${settings.tone}`);
  }

  if (settings?.behavior_notes) {
    parts.push(`ZUSÄTZLICHE VERHALTENSREGELN:\n${settings.behavior_notes}`);
  }

  if (settings?.system_prompt) {
    parts.push(`ADMIN SYSTEM-PROMPT:\n${settings.system_prompt}`);
  }

  return {
    priority: CONTEXT_PRIORITY.defaultBehavior,
    title: "Standard-Verhalten",
    content: parts.join("\n\n"),
  };
}
