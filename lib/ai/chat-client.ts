import type { AiChatMessage } from "@/lib/ai/types";

type SendChatOptions = {
  messages: AiChatMessage[];
  onStreamChunk?: (chunk: string) => void;
};

function toApiMessages(messages: AiChatMessage[]) {
  return messages
    .filter((message) => message.id !== "welcome")
    .map((message) => ({
      role: message.role,
      content: message.content,
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

export async function sendChatToApi({ messages, onStreamChunk }: SendChatOptions) {
  const apiMessages = toApiMessages(messages);

  if (apiMessages.length === 0) {
    throw new Error("Keine Nachricht zum Senden.");
  }

  const useStream = Boolean(onStreamChunk);

  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: apiMessages,
      stream: useStream,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  if (useStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onStreamChunk?.(chunk);
    }

    const trimmed = fullText.trim();

    if (!trimmed) {
      throw new Error("Leere Antwort vom Assistenten.");
    }

    return trimmed;
  }

  const data = (await response.json()) as { content?: string; error?: string };

  if (!data.content) {
    throw new Error(data.error ?? "Leere Antwort vom Assistenten.");
  }

  return data.content;
}
