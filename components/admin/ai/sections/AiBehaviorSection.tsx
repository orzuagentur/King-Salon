import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import type { AiAdminOverview } from "@/lib/data/ai-admin";

type AiBehaviorSectionProps = {
  overview: AiAdminOverview;
};

export function AiBehaviorSection({ overview }: AiBehaviorSectionProps) {
  const section = getAiAdminSection("behavior");
  const { settings } = overview;

  return (
    <AiSectionShell section={section}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Ton & Stil
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground">
            {settings?.tone?.trim() || "Standard (luxuriös, ruhig, professionell)."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Verhaltensregeln
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
            {settings?.behavior_notes?.trim() || "Keine zusätzlichen Regeln hinterlegt."}
          </p>
        </div>
      </div>

      <a
        className="mt-6 inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
        href="#prompt"
      >
        Ton & Regeln bearbeiten
      </a>
    </AiSectionShell>
  );
}
