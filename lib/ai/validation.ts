import { AI_CHAT_LIMITS } from "@/lib/ai/config";
import type { AiBookingModePayload } from "@/lib/ai/booking/types";
import type { AiChatRole } from "@/lib/ai/types";

export type ChatApiMessage = {
  role: AiChatRole;
  content: string;
};

function hasExcessiveRepeatedChars(text: string) {
  const regex = new RegExp(`(.)\\1{${AI_CHAT_LIMITS.maxRepeatedCharRun},}`, "u");
  return regex.test(text);
}

function countUrls(text: string) {
  const matches = text.match(/https?:\/\/\S+/gi);
  return matches?.length ?? 0;
}

export function parseChatRequestBody(body: unknown):
  | { ok: true; bookingMode?: AiBookingModePayload; messages: ChatApiMessage[]; stream: boolean }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Ungültige Anfrage." };
  }

  const record = body as Record<string, unknown>;
  const stream = record.stream === true;

  if (!Array.isArray(record.messages) || record.messages.length === 0) {
    return { ok: false, error: "Nachrichten fehlen." };
  }

  const messages: ChatApiMessage[] = [];

  for (const item of record.messages) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "Ungültiges Nachrichtenformat." };
    }

    const message = item as Record<string, unknown>;

    if (message.role !== "user" && message.role !== "assistant") {
      return { ok: false, error: "Ungültige Nachrichtenrolle." };
    }

    if (typeof message.content !== "string") {
      return { ok: false, error: "Nachrichtentext fehlt." };
    }

    const content = message.content.trim();

    if (!content) {
      return { ok: false, error: "Leere Nachrichten sind nicht erlaubt." };
    }

    if (content.length > AI_CHAT_LIMITS.maxMessageLength) {
      return { ok: false, error: "Nachricht ist zu lang." };
    }

    if (hasExcessiveRepeatedChars(content)) {
      return { ok: false, error: "Nachricht enthält zu viele wiederholte Zeichen." };
    }

    if (countUrls(content) > AI_CHAT_LIMITS.maxUrlCountPerMessage) {
      return { ok: false, error: "Zu viele Links in einer Nachricht." };
    }

    messages.push({ role: message.role, content });
  }

  const trimmedHistory = messages.slice(-AI_CHAT_LIMITS.maxHistoryMessages);

  if (trimmedHistory.at(-1)?.role !== "user") {
    return { ok: false, error: "Die letzte Nachricht muss vom Nutzer sein." };
  }

  let bookingMode: AiBookingModePayload | undefined;

  if (record.bookingMode && typeof record.bookingMode === "object") {
    const mode = record.bookingMode as Record<string, unknown>;

    if (mode.active === true && typeof mode.step === "string") {
      bookingMode = {
        active: true,
        step: mode.step as AiBookingModePayload["step"],
        draft: (mode.draft as AiBookingModePayload["draft"]) ?? {},
      };
    }
  }

  return { ok: true, messages: trimmedHistory, stream, bookingMode };
}
