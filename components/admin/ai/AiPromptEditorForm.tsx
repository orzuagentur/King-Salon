"use client";

import { resetAiSystemPrompt, updateAiSettings } from "@/app/admin/(dashboard)/ki-assistent/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { AiSettingsRow } from "@/lib/ai/context/types";

type AiPromptEditorFormProps = {
  settings: AiSettingsRow | null;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function AiPromptEditorForm({ settings }: AiPromptEditorFormProps) {
  return (
    <div className="space-y-6">
      <form action={updateAiSettings} className="space-y-5">
        <label className={labelClassName}>
          Ton & Stil (optional)
          <textarea
            className={`${inputClassName} min-h-24 resize-none`}
            defaultValue={settings?.tone ?? ""}
            maxLength={800}
            name="tone"
            placeholder="z.B. luxuriös, ruhig, professionell und herzlich…"
          />
          <span className="mt-2 block text-xs text-muted">Empfohlen: 1–3 Sätze.</span>
        </label>

        <label className={labelClassName}>
          Verhalten (optional)
          <textarea
            className={`${inputClassName} min-h-24 resize-none`}
            defaultValue={settings?.behavior_notes ?? ""}
            maxLength={1600}
            name="behavior_notes"
            placeholder="z.B. Immer auf Deutsch antworten. Termine über Formular/WhatsApp empfehlen…"
          />
          <span className="mt-2 block text-xs text-muted">
            Zusätzliche Regeln – kurz und klar formulieren.
          </span>
        </label>

        <label className={labelClassName}>
          System‑Prompt (optional)
          <textarea
            className={`${inputClassName} min-h-56 resize-y`}
            defaultValue={settings?.system_prompt ?? ""}
            maxLength={8000}
            name="system_prompt"
            placeholder="Hier können Sie die Persönlichkeit, Prioritäten und den Stil des Assistenten definieren…"
          />
          <span className="mt-2 block text-xs text-muted">
            Tipp: Keine Preise/Öffnungszeiten erfinden lassen – lieber auf Datenbank/Website verweisen.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
            formAction={resetAiSystemPrompt}
            type="submit"
          >
            Reset System‑Prompt
          </button>
          <AdminSubmitButton>Speichern</AdminSubmitButton>
        </div>
      </form>
    </div>
  );
}

