import { createHash } from "node:crypto";

import type { SiteContentFingerprintSource } from "@/lib/ai/site-content/types";

const STATIC_CONTENT_REVISION = "2026-05-21-v1";

export function getStaticContentRevision() {
  return STATIC_CONTENT_REVISION;
}

export function buildContentFingerprint(source: SiteContentFingerprintSource) {
  const payload = JSON.stringify({
    ...source,
    staticRevision: STATIC_CONTENT_REVISION,
  });

  return createHash("sha256").update(payload).digest("hex").slice(0, 24);
}
