import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { AiMemoryManager } from "@/components/admin/ai/AiMemoryManager";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import type { AiAdminOverview } from "@/lib/data/ai-admin";
import { getAllAiMemory } from "@/lib/data/ai-knowledge";

type AiMemorySectionProps = {
  overview: AiAdminOverview;
};

export async function AiMemorySection({ overview }: AiMemorySectionProps) {
  const section = getAiAdminSection("memory");
  const memoryItems = await getAllAiMemory();

  return (
    <AiSectionShell section={section}>
      <p className="text-sm text-muted">
        {overview.memoryTotal === 0
          ? "Noch keine gespeicherten Regeln oder Präferenzen."
          : `${overview.memoryTotal} Speicher-Einträge, ${overview.memoryActive} aktiv.`}
      </p>

      <div className="mt-6">
        <AiMemoryManager memoryItems={memoryItems} />
      </div>
    </AiSectionShell>
  );
}
