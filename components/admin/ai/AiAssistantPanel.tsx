import { AiSectionNav } from "@/components/admin/ai/AiSectionNav";
import { AiBehaviorSection } from "@/components/admin/ai/sections/AiBehaviorSection";
import { AiGeneralSection } from "@/components/admin/ai/sections/AiGeneralSection";
import { AiKnowledgeSection } from "@/components/admin/ai/sections/AiKnowledgeSection";
import { AiMemorySection } from "@/components/admin/ai/sections/AiMemorySection";
import { AiPromptSection } from "@/components/admin/ai/sections/AiPromptSection";
import { AiWebsiteSection } from "@/components/admin/ai/sections/AiWebsiteSection";
import type { AiAdminOverview } from "@/lib/data/ai-admin";

type AiAssistantPanelProps = {
  overview: AiAdminOverview;
};

export function AiAssistantPanel({ overview }: AiAssistantPanelProps) {
  return (
    <div className="space-y-6">
      <AiSectionNav />
      <div className="space-y-6">
        <AiGeneralSection overview={overview} />
        <AiPromptSection overview={overview} />
        <AiKnowledgeSection overview={overview} />
        <AiMemorySection overview={overview} />
        <AiWebsiteSection overview={overview} />
        <AiBehaviorSection overview={overview} />
      </div>
    </div>
  );
}
