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
  agent_avatar: string | null;
  agent_name: string | null;
  behavior_notes: string | null;
  language: string | null;
  system_prompt: string | null;
  theme_color: string | null;
  tone: string | null;
  updated_at: string;
  welcome_message: string | null;
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
