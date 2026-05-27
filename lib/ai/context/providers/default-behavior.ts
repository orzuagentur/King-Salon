import { CONTEXT_PRIORITY, type ContextSection } from "@/lib/ai/context/types";
import { getAiSettings } from "@/lib/data/ai-settings";
import { getHomepageContent } from "@/lib/data/homepage";

const LANGUAGE_LABELS: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch",
  tr: "Türkisch",
  ar: "Arabisch",
};

const BASE_RULES = `
STANDARD-VERHALTEN:
- Antworte höflich und im Premium-Ton des Salons.
- Kurz und präzise (2–6 Sätze), außer mehr Detail wird benötigt.
- Nutze zuerst Wissensdatenbank, dann Live-Daten, dann Website-Inhalte.
- Erfinde keine Preise, Zeiten oder Leistungen.
- Bei fehlenden Infos ehrlich bleiben und auf Telefon, WhatsApp oder Termin-Formular verweisen.
- Keine medizinischen oder rechtlichen Ratschläge.
- Keine Speicherung persönlicher Kundendaten im Chat.
`.trim();

export async function buildDefaultBehaviorContext(): Promise<ContextSection> {
  const [settings, homepage] = await Promise.all([getAiSettings(), getHomepageContent()]);

  const languageCode = settings?.language?.trim() || "de";
  const languageLabel = LANGUAGE_LABELS[languageCode] ?? languageCode;
  const customPrompt = settings?.system_prompt?.trim();
  const siteName = homepage.site_name;

  if (customPrompt) {
    const parts = [customPrompt, `SPRACHE: Antworte ausschließlich auf ${languageLabel} (Code: ${languageCode}).`];

    if (settings?.tone?.trim()) {
      parts.push(`TON & STIL:\n${settings.tone.trim()}`);
    }

    if (settings?.behavior_notes?.trim()) {
      parts.push(`ZUSÄTZLICHE REGELN:\n${settings.behavior_notes.trim()}`);
    }

    return {
      priority: CONTEXT_PRIORITY.defaultBehavior,
      title: "Admin-Instruktionen",
      content: parts.join("\n\n"),
    };
  }

  const parts = [
    `Du bist der offizielle KI-Assistent von ${siteName}.`,
    `SPRACHE: Antworte ausschließlich auf ${languageLabel} (Code: ${languageCode}).`,
    BASE_RULES,
  ];

  if (settings?.tone?.trim()) {
    parts.push(`TON & STIL: ${settings.tone.trim()}`);
  }

  if (settings?.behavior_notes?.trim()) {
    parts.push(`ZUSÄTZLICHE VERHALTENSREGELN:\n${settings.behavior_notes.trim()}`);
  }

  return {
    priority: CONTEXT_PRIORITY.defaultBehavior,
    title: "Standard-Verhalten",
    content: parts.join("\n\n"),
  };
}
