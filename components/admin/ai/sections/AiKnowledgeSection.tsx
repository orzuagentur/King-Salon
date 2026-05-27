import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { AiKnowledgeManager } from "@/components/admin/ai/AiKnowledgeManager";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import type { AiAdminOverview } from "@/lib/data/ai-admin";
import { getAllAiKnowledge } from "@/lib/data/ai-knowledge";

type AiKnowledgeSectionProps = {
  overview: AiAdminOverview;
};

export async function AiKnowledgeSection({ overview }: AiKnowledgeSectionProps) {
  const section = getAiAdminSection("knowledge");
  const knowledge = await getAllAiKnowledge();

  return (
    <AiSectionShell section={section}>
      <p className="text-sm text-muted">
        {overview.knowledgeTotal === 0
          ? "Noch keine Einträge in der Wissensdatenbank."
          : `${overview.knowledgeTotal} Einträge gesamt, ${overview.knowledgeActive} aktiv im Chat.`}
      </p>

      <div className="mt-6">
        <AiKnowledgeManager knowledge={knowledge} />
      </div>
    </AiSectionShell>
  );
}
