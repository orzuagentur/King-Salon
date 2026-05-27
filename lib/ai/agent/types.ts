export type AiAgentAvatar = "spark" | "crown" | "scissors" | "custom";

export type AiAgentConfig = {
  agentAvatar: string;
  agentName: string;
  language: string;
  themeColor: string;
  welcomeMessage: string;
};

export const defaultAiAgentConfig: AiAgentConfig = {
  agentName: "King Salon Assistent",
  agentAvatar: "spark",
  welcomeMessage:
    "Willkommen bei King Salon Celle. Ich helfe bei Leistungen, Preisen und Öffnungszeiten — und Sie können direkt einen Termin buchen.",
  language: "de",
  themeColor: "#c8a45d",
};
