import type { AiSettingsRow } from "@/lib/ai/context/types";
import { getSiteContentSyncMeta } from "@/lib/ai/site-content/snapshot";
import { getAiSettings } from "@/lib/data/ai-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AiAdminOverview = {
  geminiConfigured: boolean;
  knowledgeActive: number;
  knowledgeTotal: number;
  memoryActive: number;
  memoryTotal: number;
  settings: AiSettingsRow | null;
  siteContent: {
    currentFingerprint: string;
    fingerprint: string;
    isStale: boolean;
    pageCount: number;
    syncedAt: string;
  };
};

export async function getAiAdminOverview(): Promise<AiAdminOverview> {
  const supabase = await createSupabaseServerClient();

  const [settings, knowledgeTotal, knowledgeActive, memoryTotal, memoryActive, siteContent] =
    await Promise.all([
      getAiSettings(),
      supabase.from("ai_knowledge").select("id", { count: "exact", head: true }),
      supabase
        .from("ai_knowledge")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
      supabase.from("ai_memory").select("id", { count: "exact", head: true }),
      supabase.from("ai_memory").select("id", { count: "exact", head: true }).eq("active", true),
      getSiteContentSyncMeta(),
    ]);

  return {
    settings,
    knowledgeTotal: knowledgeTotal.count ?? 0,
    knowledgeActive: knowledgeActive.count ?? 0,
    memoryTotal: memoryTotal.count ?? 0,
    memoryActive: memoryActive.count ?? 0,
    siteContent,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  };
}
