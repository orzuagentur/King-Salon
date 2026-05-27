export function formatChatTime(isoDate: string) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function createMessageId() {
  return crypto.randomUUID();
}
