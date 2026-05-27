import type { AiChatMessage } from "@/lib/ai/types";

const SESSION_KEY = "kingsalon-ai-chat-session-v1";

type StoredSession = {
  messages: AiChatMessage[];
  updatedAt: string;
};

export function loadChatSession(): AiChatMessage[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredSession;
    if (!Array.isArray(parsed.messages)) {
      return null;
    }

    return parsed.messages;
  } catch {
    return null;
  }
}

export function saveChatSession(messages: AiChatMessage[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredSession = {
    messages,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

export function clearChatSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
}
