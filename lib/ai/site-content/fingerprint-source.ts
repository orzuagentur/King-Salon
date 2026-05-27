import type { SiteContentFingerprintSource } from "@/lib/ai/site-content/types";
import { getStaticContentRevision } from "@/lib/ai/site-content/fingerprint";
import { getActiveAiKnowledge } from "@/lib/data/ai-knowledge";
import { getActiveServices } from "@/lib/data/services";
import { getSettings } from "@/lib/data/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function fetchFingerprintSource(): Promise<SiteContentFingerprintSource> {
  const supabase = await createSupabaseServerClient();

  const [settings, services, galleryResult, reviewsResult, knowledge] = await Promise.all([
      getSettings(),
      getActiveServices(),
      supabase.from("gallery").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("active", true),
      getActiveAiKnowledge(),
    ]);

  const homepageRow = await supabase
    .from("homepage_content")
    .select("updated_at")
    .eq("id", "main")
    .maybeSingle();

  return {
    homepageUpdatedAt: homepageRow.data?.updated_at ?? null,
    settingsUpdatedAt: settings?.updated_at ?? null,
    serviceRevisions: services.map((service) => ({
      id: service.id,
      updated_at: service.updated_at,
    })),
    galleryCount: galleryResult.count ?? 0,
    reviewCount: reviewsResult.count ?? 0,
    knowledgeCount: knowledge.length,
    staticRevision: getStaticContentRevision(),
  };
}
