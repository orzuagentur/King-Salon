import { invalidateContextCache } from "@/lib/ai/context/cache";
import { buildFormattedSiteContent } from "@/lib/ai/site-content/extract";
import { buildContentFingerprint } from "@/lib/ai/site-content/fingerprint";
import { fetchFingerprintSource } from "@/lib/ai/site-content/fingerprint-source";
import { extractSiteContentPages } from "@/lib/ai/site-content/extract";
import type { SiteContentSnapshot } from "@/lib/ai/site-content/types";
import {
  getPersistedSiteContentCache,
  persistSiteContentCache,
} from "@/lib/data/ai-site-content-cache";

let memorySnapshot: SiteContentSnapshot | null = null;

export function invalidateSiteContentCache() {
  memorySnapshot = null;
  invalidateContextCache();
}

async function buildFreshSnapshot(fingerprint: string): Promise<SiteContentSnapshot> {
  const pages = await extractSiteContentPages();
  const syncedAt = new Date().toISOString();

  const snapshot: SiteContentSnapshot = {
    fingerprint,
    syncedAt,
    pageCount: pages.length,
    pages,
    formatted: buildFormattedSiteContent(pages),
  };

  memorySnapshot = snapshot;
  await persistSiteContentCache(snapshot);

  return snapshot;
}

export async function getSiteContentSnapshot(options?: {
  forceRefresh?: boolean;
}): Promise<SiteContentSnapshot> {
  const source = await fetchFingerprintSource();
  const fingerprint = buildContentFingerprint(source);

  if (!options?.forceRefresh && memorySnapshot?.fingerprint === fingerprint) {
    return memorySnapshot;
  }

  if (!options?.forceRefresh) {
    const persisted = await getPersistedSiteContentCache(fingerprint);

    if (persisted) {
      memorySnapshot = persisted;
      return persisted;
    }
  }

  invalidateContextCache();
  return buildFreshSnapshot(fingerprint);
}

export async function getSiteContentSyncMeta() {
  const snapshot = await getSiteContentSnapshot();
  const source = await fetchFingerprintSource();
  const currentFingerprint = buildContentFingerprint(source);

  return {
    currentFingerprint,
    fingerprint: snapshot.fingerprint,
    isStale: snapshot.fingerprint !== currentFingerprint,
    pageCount: snapshot.pageCount,
    syncedAt: snapshot.syncedAt,
  };
}

export async function refreshSiteContentSnapshot() {
  const snapshot = await getSiteContentSnapshot({ forceRefresh: true });
  const source = await fetchFingerprintSource();
  const currentFingerprint = buildContentFingerprint(source);

  return {
    currentFingerprint,
    fingerprint: snapshot.fingerprint,
    isStale: snapshot.fingerprint !== currentFingerprint,
    pageCount: snapshot.pageCount,
    syncedAt: snapshot.syncedAt,
  };
}
