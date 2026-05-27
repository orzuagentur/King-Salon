export type AiChatRole = "assistant" | "user";

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
};
