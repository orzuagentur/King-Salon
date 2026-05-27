import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import type { AiAdminOverview } from "@/lib/data/ai-admin";

type AiGeneralSectionProps = {
  overview: AiAdminOverview;
};

function StatTile({ hint, label, value }: { hint: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AiGeneralSection({ overview }: AiGeneralSectionProps) {
  const section = getAiAdminSection("general");

  return (
    <AiSectionShell section={section}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatTile
          hint="Sichtbar auf der Website für Besucher"
          label="Chat-Assistent"
          value="King Salon Assistent"
        />
        <StatTile
          hint={overview.geminiConfigured ? "GEMINI_API_KEY ist gesetzt" : "Schlüssel in .env fehlt"}
          label="Gemini API"
          value={overview.geminiConfigured ? "Verbunden" : "Nicht konfiguriert"}
        />
        <StatTile
          hint="Letzte Änderung der KI-Einstellungen"
          label="Einstellungen"
          value={
            overview.settings?.updated_at
              ? formatDate(overview.settings.updated_at)
              : "Noch nicht angelegt"
          }
        />
        <StatTile
          hint={`${overview.knowledgeActive} aktiv`}
          label="Wissensdatenbank"
          value={String(overview.knowledgeTotal)}
        />
        <StatTile
          hint={`${overview.memoryActive} aktiv`}
          label="KI-Speicher"
          value={String(overview.memoryTotal)}
        />
        <StatTile
          hint={`Fingerprint: ${overview.siteContent.fingerprint.slice(0, 12)}…`}
          label="Website-Kontext"
          value={`${overview.siteContent.pageCount} Seiten`}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-sm leading-6 text-muted">
        <p className="font-medium text-foreground">Kontext-Priorität</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Wissensdatenbank aus diesem Admin-Bereich</li>
          <li>Live-Daten (Leistungen, Team, Kontakt, Öffnungszeiten)</li>
          <li>Automatisch gelesene Website-Inhalte</li>
          <li>Standard-Verhalten und Prompt-Einstellungen</li>
        </ol>
      </div>

      {!overview.geminiConfigured ? (
        <p className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Tragen Sie <code className="text-gold-soft">GEMINI_API_KEY</code> in der Umgebung ein, damit
          der Chat auf der Website antworten kann.
        </p>
      ) : null}
    </AiSectionShell>
  );
}
