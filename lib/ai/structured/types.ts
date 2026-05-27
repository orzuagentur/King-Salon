export type AiTableBlock = {
  type: "table";
  title?: string;
  columns: string[];
  rows: string[][];
};

export type AiKeyValueBlock = {
  type: "key_value";
  title?: string;
  items: { label: string; value: string }[];
};

export type AiListBlock = {
  type: "list";
  title?: string;
  items: string[];
};

export type AiCtaBlock = {
  type: "cta";
  label: string;
  action: "book" | "contact";
};

export type AiStructuredBlock = AiTableBlock | AiKeyValueBlock | AiListBlock | AiCtaBlock;

export type AiStructuredResponse = {
  text: string;
  blocks?: AiStructuredBlock[];
};
