import type { AiStructuredResponse } from "@/lib/ai/structured/types";
import type { AiChatMessage } from "@/lib/ai/types";

export type AiChatApiResult = {
  structured: AiStructuredResponse;
};

type SendChatOptions = {
  messages: AiChatMessage[];
};

function toApiMessages(messages: AiChatMessage[]) {
  return messages
    .filter((message) => message.id !== "welcome" && message.status !== "error")
    .map((message) => ({
      role: message.role,
      content: message.structured?.text ?? message.content,
    }));
}

async function parseErrorResponse(response: Response) {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? "Anfrage fehlgeschlagen.";
  } catch {
    return "Anfrage fehlgeschlagen.";
  }
}

export async function sendChatToApi({ messages }: SendChatOptions): Promise<AiChatApiResult> {
  const apiMessages = toApiMessages(messages);

  if (apiMessages.length === 0) {
    throw new Error("Keine Nachricht zum Senden.");
  }

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: apiMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const data = (await response.json()) as { structured?: AiStructuredResponse; error?: string };

  if (!data.structured?.text) {
    throw new Error(data.error ?? "Leere Antwort vom Assistenten.");
  }

  return { structured: data.structured };
}
