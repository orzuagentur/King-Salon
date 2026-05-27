export type AiAdminSectionId =
  | "general"
  | "prompt"
  | "knowledge"
  | "memory"
  | "website"
  | "behavior";

export type AiAdminSection = {
  description: string;
  id: AiAdminSectionId;
  label: string;
  title: string;
};

export const aiAdminSections: AiAdminSection[] = [
  {
    id: "general",
    label: "Allgemein",
    title: "Allgemeine Einstellungen",
    description: "Status, API und Übersicht des KI-Assistenten.",
  },
  {
    id: "prompt",
    label: "System-Prompt",
    title: "Prompt-Einstellungen",
    description: "System-Prompt und Persönlichkeit des Assistenten.",
  },
  {
    id: "knowledge",
    label: "Wissensdatenbank",
    title: "Wissensdatenbank",
    description: "FAQ, Richtlinien und feste Antworten für den Chat.",
  },
  {
    id: "memory",
    label: "Speicher",
    title: "KI-Speicher",
    description: "Langfristige Regeln und wichtige Geschäftsinformationen.",
  },
  {
    id: "website",
    label: "Website-Training",
    title: "Website-Training",
    description: "Automatisch gelesene Inhalte der Website für den Kontext.",
  },
  {
    id: "behavior",
    label: "Verhalten",
    title: "KI-Verhalten",
    description: "Ton, Stil und zusätzliche Verhaltensregeln.",
  },
];

export function getAiAdminSection(id: AiAdminSectionId) {
  return aiAdminSections.find((section) => section.id === id) ?? aiAdminSections[0];
}
