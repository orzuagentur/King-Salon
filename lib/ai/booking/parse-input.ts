const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DE_DATE_PATTERN = /^(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?$/;
const TIME_PATTERN = /(\d{1,2})[:.](\d{2})/;
const TIME_UHR_PATTERN = /(\d{1,2})\s*uhr/i;
const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_PATTERN = /(\+?\d[\d\s()./-]{7,}\d)/;

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

export function parseGermanDateInput(text: string, reference = new Date()) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (ISO_DATE_PATTERN.test(normalized)) {
    return normalized;
  }

  if (/(heute|today)/.test(normalized)) {
    return reference.toISOString().slice(0, 10);
  }

  if (/(morgen|tomorrow)/.test(normalized)) {
    const next = new Date(reference);
    next.setDate(next.getDate() + 1);
    return next.toISOString().slice(0, 10);
  }

  if (/(übermorgen|uebermorgen)/.test(normalized)) {
    const next = new Date(reference);
    next.setDate(next.getDate() + 2);
    return next.toISOString().slice(0, 10);
  }

  const deMatch = normalized.match(DE_DATE_PATTERN);

  if (deMatch) {
    const day = Number(deMatch[1]);
    const month = Number(deMatch[2]);
    const yearPart = deMatch[3] ? Number(deMatch[3]) : reference.getFullYear();
    const year = yearPart < 100 ? 2000 + yearPart : yearPart;

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return toIsoDate(year, month, day);
    }
  }

  return null;
}

export function parseTimeInput(text: string) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const direct = normalized.match(TIME_PATTERN);

  if (direct) {
    const hours = Number(direct[1]);
    const minutes = Number(direct[2]);

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return `${padDatePart(hours)}:${padDatePart(minutes)}`;
    }
  }

  const uhr = normalized.match(TIME_UHR_PATTERN);

  if (uhr) {
    const hours = Number(uhr[1]);

    if (hours >= 0 && hours <= 23) {
      return `${padDatePart(hours)}:00`;
    }
  }

  return null;
}

export function parseEmailInput(text: string) {
  const match = text.match(EMAIL_PATTERN);
  return match?.[0] ?? null;
}

export function parsePhoneInput(text: string) {
  const match = text.match(PHONE_PATTERN);

  if (!match?.[1]) {
    return null;
  }

  return match[1].replace(/\s+/g, " ").trim();
}

export function parseNameInput(text: string) {
  const cleaned = text.trim();

  if (cleaned.length < 2 || cleaned.length > 80) {
    return null;
  }

  if (parseEmailInput(cleaned) || parseGermanDateInput(cleaned) || parseTimeInput(cleaned)) {
    return null;
  }

  return cleaned;
}

export function findMasterIdByName(
  text: string,
  masters: { id: string; name: string }[],
) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  const exact = masters.find((master) => master.name.toLowerCase() === normalized);

  if (exact) {
    return exact.id;
  }

  const partial = masters.find(
    (master) =>
      normalized.includes(master.name.toLowerCase()) ||
      master.name.toLowerCase().includes(normalized),
  );

  return partial?.id ?? null;
}
