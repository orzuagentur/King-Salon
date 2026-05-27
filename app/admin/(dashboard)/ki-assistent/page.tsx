import type { Metadata } from "next";

import { AiAssistantPanel } from "@/components/admin/ai/AiAssistantPanel";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/auth/admin";
import { getAiAdminOverview } from "@/lib/data/ai-admin";
import { adminMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = adminMetadata;

export default async function AdminAiAssistantPage() {
  const { admin } = await requireAdmin();
  const overview = await getAiAdminOverview();

  return (
    <div className="space-y-8">
      <AdminHeader
        description="System-Prompt, Wissensdatenbank, Speicher und Website-Kontext für den KI-Chat steuern."
        role={admin.role === "admin" ? "Administrator" : "Editor"}
        title="KI-Assistent"
      />

      <AiAssistantPanel overview={overview} />
    </div>
  );
}
