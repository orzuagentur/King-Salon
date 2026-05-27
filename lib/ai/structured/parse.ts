import type { AiStructuredBlock, AiStructuredResponse } from "@/lib/ai/structured/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseBlock(value: unknown): AiStructuredBlock | null {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null;
  }

  if (value.type === "table" && Array.isArray(value.columns) && Array.isArray(value.rows)) {
    return {
      type: "table",
      title: typeof value.title === "string" ? value.title : undefined,
      columns: value.columns.filter((item): item is string => typeof item === "string"),
      rows: value.rows
        .filter((row): row is unknown[] => Array.isArray(row))
        .map((row) => row.filter((cell): cell is string => typeof cell === "string")),
    };
  }

  if (value.type === "key_value" && Array.isArray(value.items)) {
    const items = value.items
      .filter(isRecord)
      .map((item) => ({
        label: typeof item.label === "string" ? item.label : "",
        value: typeof item.value === "string" ? item.value : "",
      }))
      .filter((item) => item.label && item.value);

    if (items.length === 0) {
      return null;
    }

    return {
      type: "key_value",
      title: typeof value.title === "string" ? value.title : undefined,
      items,
    };
  }

  if (value.type === "list" && Array.isArray(value.items)) {
    const items = value.items.filter((item): item is string => typeof item === "string");
    if (items.length === 0) {
      return null;
    }
    return {
      type: "list",
      title: typeof value.title === "string" ? value.title : undefined,
      items,
    };
  }

  if (
    value.type === "cta" &&
    typeof value.label === "string" &&
    (value.action === "book" || value.action === "contact")
  ) {
    return { type: "cta", label: value.label, action: value.action };
  }

  return null;
}

export function parseStructuredResponse(raw: string): AiStructuredResponse {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { text: "" };
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();

  try {
    const parsed: unknown = JSON.parse(candidate);

    if (!isRecord(parsed)) {
      return { text: trimmed };
    }

    const text = typeof parsed.text === "string" ? parsed.text : trimmed;
    const blocks = Array.isArray(parsed.blocks)
      ? parsed.blocks.map(parseBlock).filter((block): block is AiStructuredBlock => block !== null)
      : undefined;

    return { text, blocks: blocks?.length ? blocks : undefined };
  } catch {
    return { text: trimmed };
  }
}
