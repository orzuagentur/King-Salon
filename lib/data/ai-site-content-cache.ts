import type { SiteContentPage, SiteContentSnapshot } from "@/lib/ai/site-content/types";
import { buildFormattedSiteContent } from "@/lib/ai/site-content/extract";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CachedPayload = {
  pages: SiteContentPage[];
};

export async function getPersistedSiteContentCache(fingerprint: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_site_content_cache")
    .select("fingerprint, payload, page_count, synced_at")
    .eq("id", "main")
    .eq("fingerprint", fingerprint)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const payload = data.payload as CachedPayload;

  if (!payload?.pages?.length) {
    return null;
  }

  const snapshot: SiteContentSnapshot = {
    fingerprint: data.fingerprint,
    syncedAt: data.synced_at,
    pageCount: data.page_count,
    pages: payload.pages,
    formatted: buildFormattedSiteContent(payload.pages),
  };

  return snapshot;
}

export async function persistSiteContentCache(snapshot: SiteContentSnapshot) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_site_content_cache").upsert({
    id: "main",
    fingerprint: snapshot.fingerprint,
    payload: { pages: snapshot.pages },
    page_count: snapshot.pageCount,
    synced_at: snapshot.syncedAt,
  });

  if (error) {
    console.error("Failed to persist AI site content cache", error);
  }
}
