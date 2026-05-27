import type { AiStructuredResponse } from "@/lib/ai/structured/types";

export type AiChatRole = "assistant" | "user";

export type AiMessageStatus = "sent" | "sending" | "streaming" | "error";

export type AiChatMessage = {
  id: string;
  role: AiChatRole;
  content: string;
  createdAt: string;
  status?: AiMessageStatus;
  structured?: AiStructuredResponse;
  retryPayload?: string;
};
