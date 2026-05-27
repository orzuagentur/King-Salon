import { CONTEXT_PRIORITY, type ContextSection } from "@/lib/ai/context/types";
import { getSiteContentSnapshot } from "@/lib/ai/site-content/snapshot";

export async function buildSiteContentContext(): Promise<ContextSection> {
  const snapshot = await getSiteContentSnapshot();

  return {
    priority: CONTEXT_PRIORITY.siteContent,
    title: "Website-Inhalte (indexiert)",
    content: [
      `Zuletzt synchronisiert: ${snapshot.syncedAt}`,
      `Seiten im Index: ${snapshot.pageCount}`,
      "",
      snapshot.formatted,
    ].join("\n"),
  };
}
