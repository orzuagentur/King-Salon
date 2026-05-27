export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY?.trim() ?? "";
}

export function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";
}

export function isGeminiConfigured() {
  return Boolean(getGeminiApiKey());
}

export const AI_CHAT_LIMITS = {
  maxMessageLength: 2000,
  maxHistoryMessages: 20,
  maxHistoryCharsForModel: 7000,
  maxSystemInstructionChars: 12000,
  maxRequestsPerWindow: 15,
  rateLimitWindowMs: 60_000,
  minSecondsBetweenRequests: 2,
  maxDuplicateMessagesInWindow: 3,
  maxUrlCountPerMessage: 3,
  maxRepeatedCharRun: 14,
} as const;
