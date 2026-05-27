import { GoogleGenerativeAI } from "@google/generative-ai";

import { AI_CHAT_LIMITS, getGeminiApiKey, getGeminiModel } from "@/lib/ai/config";
import { buildAiSystemInstruction } from "@/lib/ai/context/engine";
import { aiResponseSchema, structuredResponseInstruction } from "@/lib/ai/gemini/structured-schema";
import { parseStructuredResponse } from "@/lib/ai/structured/parse";
import type { AiStructuredResponse } from "@/lib/ai/structured/types";
import type { ChatApiMessage } from "@/lib/ai/validation";

function getGeminiClient() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ist nicht konfiguriert.");
  }

  return new GoogleGenerativeAI(apiKey);
}

function toGeminiHistory(messages: ChatApiMessage[]) {
  const history = messages.slice(0, -1);

  return history.map((message) => ({
    role: message.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: message.content }],
  }));
}

function trimMessagesForModel(messages: ChatApiMessage[]) {
  const result: ChatApiMessage[] = [];
  let totalChars = 0;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    const nextSize = totalChars + message.content.length;

    if (result.length === 0 && message.role === "user") {
      result.unshift(message);
      totalChars = nextSize;
      continue;
    }

    if (nextSize > AI_CHAT_LIMITS.maxHistoryCharsForModel) {
      break;
    }

    result.unshift(message);
    totalChars = nextSize;
  }

  const last = result.at(-1);
  if (!last || last.role !== "user") {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    return lastUser ? [lastUser] : [];
  }

  return result;
}

async function createModel(messages: ChatApiMessage[]) {
  const optimizedMessages = trimMessagesForModel(messages);
  const systemInstruction = `${await buildAiSystemInstruction({ messages: optimizedMessages })}\n\n${structuredResponseInstruction}`;
  const client = getGeminiClient();

  return {
    model: client.getGenerativeModel({
      model: getGeminiModel(),
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: aiResponseSchema,
      },
    }),
    optimizedMessages,
  };
}

export async function generateGeminiStructuredReply(
  messages: ChatApiMessage[],
): Promise<AiStructuredResponse> {
  const { model, optimizedMessages } = await createModel(messages);
  const lastMessage = optimizedMessages.at(-1);

  if (!lastMessage || lastMessage.role !== "user") {
    throw new Error("Ungültiger Chat-Verlauf.");
  }

  const chat = model.startChat({
    history: toGeminiHistory(optimizedMessages),
  });

  const result = await chat.sendMessage(lastMessage.content);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Leere Antwort vom KI-Dienst.");
  }

  return parseStructuredResponse(text);
}

export async function streamGeminiStructuredReply(messages: ChatApiMessage[]) {
  const { model, optimizedMessages } = await createModel(messages);
  const lastMessage = optimizedMessages.at(-1);

  if (!lastMessage || lastMessage.role !== "user") {
    throw new Error("Ungültiger Chat-Verlauf.");
  }

  const chat = model.startChat({
    history: toGeminiHistory(optimizedMessages),
  });

  return chat.sendMessageStream(lastMessage.content);
}

export async function parseStreamedStructuredReply(stream: AsyncIterable<{ text: () => string }>) {
  let raw = "";

  for await (const chunk of stream) {
    const text = chunk.text();
    if (text) {
      raw += text;
    }
  }

  if (!raw.trim()) {
    throw new Error("Leere Antwort vom KI-Dienst.");
  }

  return parseStructuredResponse(raw);
}
