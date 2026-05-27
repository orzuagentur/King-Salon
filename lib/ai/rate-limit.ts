import { AI_CHAT_LIMITS } from "@/lib/ai/config";

type RateLimitEntry = {
  count: number;
  duplicateCount: number;
  lastMessage: string;
  lastRequestAt: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}

export function checkRateLimit(clientId: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      duplicateCount: 0,
      lastMessage: "",
      lastRequestAt: now,
      resetAt: now + AI_CHAT_LIMITS.rateLimitWindowMs,
    });

    return { allowed: true as const };
  }

  if (entry.count >= AI_CHAT_LIMITS.maxRequestsPerWindow) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);

    return {
      allowed: false as const,
      retryAfterSeconds,
    };
  }

  entry.count += 1;
  entry.lastRequestAt = now;
  rateLimitStore.set(clientId, entry);

  return { allowed: true as const };
}

export function checkAntiSpam(clientId: string, message: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);

  if (!entry || entry.resetAt <= now) {
    return { allowed: true as const };
  }

  const minIntervalMs = AI_CHAT_LIMITS.minSecondsBetweenRequests * 1000;
  if (now - entry.lastRequestAt < minIntervalMs) {
    return {
      allowed: false as const,
      retryAfterSeconds: Math.ceil((minIntervalMs - (now - entry.lastRequestAt)) / 1000),
      reason: "too_fast" as const,
    };
  }

  if (entry.lastMessage === message) {
    entry.duplicateCount += 1;
  } else {
    entry.lastMessage = message;
    entry.duplicateCount = 1;
  }

  rateLimitStore.set(clientId, entry);

  if (entry.duplicateCount > AI_CHAT_LIMITS.maxDuplicateMessagesInWindow) {
    return {
      allowed: false as const,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      reason: "duplicate" as const,
    };
  }

  return { allowed: true as const };
}
