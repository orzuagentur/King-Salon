import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { refreshAiWebsiteTraining } from "@/app/admin/(dashboard)/ki-assistent/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import type { AiAdminOverview } from "@/lib/data/ai-admin";

type AiWebsiteSectionProps = {
  overview: AiAdminOverview;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AiWebsiteSection({ overview }: AiWebsiteSectionProps) {
  const section = getAiAdminSection("website");
  const { siteContent } = overview;
  const statusLabel = siteContent.isStale ? "Neu-Synchronisierung empfohlen" : "Aktuell";

  return (
    <AiSectionShell section={section}>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Indexierte Seiten
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{siteContent.pageCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Index-Status
          </p>
          <p
            className={`mt-2 text-sm font-semibold ${
              siteContent.isStale ? "text-amber-200" : "text-emerald-200"
            }`}
          >
            {statusLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4 sm:col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Letzte Synchronisation
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {formatDate(siteContent.syncedAt)}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-muted">
            Snapshot: {siteContent.fingerprint}
          </p>
          <p className="mt-2 break-all font-mono text-xs text-muted">
            Aktuell: {siteContent.currentFingerprint}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Der Assistent liest automatisch Hero, Leistungen, Preise, Galerie, Bewertungen, Kontakt und
        FAQ-Inhalte. Bei Änderungen im CMS wird der Index anhand eines Fingerprints neu aufgebaut.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Website-Inhalte neu synchronisieren</p>
            <p className="mt-1 text-sm text-muted">
              Startet eine manuelle Neu-Indizierung von Website-Texten und aktualisiert den AI-Kontext.
            </p>
          </div>
          <form action={refreshAiWebsiteTraining}>
            <AdminSubmitButton loadingLabel="Synchronisiert…" variant="secondary">
              Jetzt synchronisieren
            </AdminSubmitButton>
          </form>
        </div>
      </div>
    </AiSectionShell>
  );
}
