export const CONTEXT_PRIORITY = {
  knowledgeBase: 1,
  database: 2,
  siteContent: 3,
  defaultBehavior: 4,
} as const;

export type ContextPriority = (typeof CONTEXT_PRIORITY)[keyof typeof CONTEXT_PRIORITY];

export type ContextSection = {
  priority: ContextPriority;
  title: string;
  content: string;
};

export type AiSettingsRow = {
  id: string;
  system_prompt: string | null;
  tone: string | null;
  behavior_notes: string | null;
  updated_at: string;
};

export type AiKnowledgeRow = {
  id: string;
  category: string;
  title: string;
  content: string;
  pinned: boolean;
  active: boolean;
  sort_order: number;
};

export type AiMemoryRow = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  active: boolean;
  sort_order: number;
};
