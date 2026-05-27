const CONTEXT_CACHE_TTL_MS = 5 * 60 * 1000;

let cachedInstruction: { expiresAt: number; value: string } | null = null;

export function getCachedSystemInstruction() {
  if (!cachedInstruction || cachedInstruction.expiresAt <= Date.now()) {
    return null;
  }

  return cachedInstruction.value;
}

export function setCachedSystemInstruction(value: string) {
  cachedInstruction = {
    value,
    expiresAt: Date.now() + CONTEXT_CACHE_TTL_MS,
  };
}

export function invalidateContextCache() {
  cachedInstruction = null;
}
