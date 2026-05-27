import { AiSectionShell } from "@/components/admin/ai/AiSectionShell";
import { AiPromptEditorForm } from "@/components/admin/ai/AiPromptEditorForm";
import { getAiAdminSection } from "@/lib/admin/ai-sections";
import { getContextPreview } from "@/lib/ai/context/engine";
import type { AiAdminOverview } from "@/lib/data/ai-admin";

type AiPromptSectionProps = {
  overview: AiAdminOverview;
};

export async function AiPromptSection({ overview }: AiPromptSectionProps) {
  const section = getAiAdminSection("prompt");
  const prompt = overview.settings?.system_prompt?.trim();
  const tone = overview.settings?.tone?.trim();
  const behavior = overview.settings?.behavior_notes?.trim();

  return (
    <AiSectionShell section={section}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4 lg:col-span-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Aktueller Status
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                Ton & Stil
              </dt>
              <dd className="mt-1 text-foreground">{tone || "Standard"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                Verhalten
              </dt>
              <dd className="mt-1 text-foreground">{behavior ? "Benutzerdefiniert" : "Standard"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
                System‑Prompt
              </dt>
              <dd className="mt-1 text-foreground">{prompt ? "Benutzerdefiniert" : "Nicht gesetzt"}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2">
          <AiPromptEditorForm settings={overview.settings} />
        </div>
      </div>

      <details className="mt-6 rounded-2xl border border-border bg-background p-4">
        <summary className="cursor-pointer select-none text-sm font-semibold text-foreground">
          Vorschau: an Gemini gesendete Instruktion
        </summary>
        <div className="mt-4 text-xs text-muted">
          Zeigt die tatsächliche System-Instruktion. Bei gesetztem System-Prompt gelten nur Ihre
          Admin-Regeln — nicht die eingebauten Standard-Texte.
        </div>
        <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-surface p-4 text-xs leading-6 text-foreground">
          {(await getContextPreview()).instruction}
        </pre>
      </details>
    </AiSectionShell>
  );
}
