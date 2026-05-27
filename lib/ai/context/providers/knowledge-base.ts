import { CONTEXT_PRIORITY, type ContextSection } from "@/lib/ai/context/types";
import { getActiveAiKnowledge, getActiveAiMemory } from "@/lib/data/ai-knowledge";

function groupKnowledgeByCategory(
  items: Awaited<ReturnType<typeof getActiveAiKnowledge>>,
) {
  const groups = new Map<string, typeof items>();

  for (const item of items) {
    const list = groups.get(item.category) ?? [];
    list.push(item);
    groups.set(item.category, list);
  }

  return groups;
}

export async function buildKnowledgeBaseContext(): Promise<ContextSection | null> {
  const [knowledge, memory] = await Promise.all([getActiveAiKnowledge(), getActiveAiMemory()]);

  if (knowledge.length === 0 && memory.length === 0) {
    return null;
  }

  const parts: string[] = [];

  if (memory.length > 0) {
    parts.push(
      "WICHTIGE GEDÄCHTNIS-REGELN:",
      ...memory.map((entry) => `- ${entry.title}: ${entry.content}`),
    );
  }

  const grouped = groupKnowledgeByCategory(knowledge);

  for (const [category, entries] of grouped) {
    parts.push(
      `${category.toUpperCase()}:`,
      ...entries.map((entry) => `- ${entry.title}: ${entry.content}`),
    );
  }

  return {
    priority: CONTEXT_PRIORITY.knowledgeBase,
    title: "Wissensdatenbank (Admin)",
    content: parts.join("\n"),
  };
}
