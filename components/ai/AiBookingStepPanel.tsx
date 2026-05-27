"use client";

import type { AiBookingStep } from "@/lib/ai/booking/types";
import type { DateAvailability } from "@/lib/booking/types";

type AiBookingStepPanelProps = {
  availability: DateAvailability | null;
  selectedTime?: string;
  fieldError: string;
  onCancel: () => void;
  onSelectDate: (dateIso: string) => void;
  onSelectMaster: (masterId: string) => void;
  onSelectTime: (time: string) => void;
  step: AiBookingStep;
};

const STEP_LABELS: Record<AiBookingStep, string> = {
  date: "Schritt 1 · Datum",
  time: "Schritt 2 · Uhrzeit",
  master: "Schritt 3 · Meister",
  name: "Schritt 4 · Name",
  phone: "Schritt 5 · Telefon",
  email: "Schritt 6 · E-Mail",
  confirm: "Schritt 7 · Bestätigung",
  done: "Fertig",
};

function getNextDays(count: number) {
  const days: string[] = [];
  const base = new Date();

  for (let index = 0; index < count; index += 1) {
    const next = new Date(base);
    next.setDate(base.getDate() + index);
    days.push(next.toISOString().slice(0, 10));
  }

  return days;
}

export function AiBookingStepPanel({
  availability,
  selectedTime,
  fieldError,
  onCancel,
  onSelectDate,
  onSelectMaster,
  onSelectTime,
  step,
}: AiBookingStepPanelProps) {
  const upcomingDays = getNextDays(7);

  return (
    <div className="mx-4 mb-2 rounded-2xl border border-[var(--ai-accent)]/30 bg-surface-elevated p-4 sm:mx-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--ai-accent)]">
          {STEP_LABELS[step]}
        </p>
        <button
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted transition hover:text-foreground"
          onClick={onCancel}
          type="button"
        >
          Abbrechen
        </button>
      </div>

      {fieldError ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {fieldError}
        </p>
      ) : null}

      {step === "date" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {upcomingDays.map((dateIso) => (
            <button
              className="touch-press rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)]"
              key={dateIso}
              onClick={() => onSelectDate(dateIso)}
              type="button"
            >
              {dateIso}
            </button>
          ))}
        </div>
      ) : null}

      {step === "time" && availability?.slots.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {availability.slots.map((slot) => (
            <button
              className="touch-press rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)]"
              key={slot}
              onClick={() => onSelectTime(slot)}
              type="button"
            >
              {slot}
            </button>
          ))}
        </div>
      ) : null}

      {step === "master" && availability && availability.masters.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {availability.masters.map((master) => {
            const slots = availability.availabilityByMaster[master.id] ?? [];
            const isFree = selectedTime ? slots.includes(selectedTime) : slots.length > 0;

            return (
              <button
                className="touch-press rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!isFree}
                key={master.id}
                onClick={() => onSelectMaster(master.id)}
                type="button"
              >
                {master.name}
              </button>
            );
          })}
        </div>
      ) : null}

      {step === "confirm" ? (
        <p className="mt-3 text-xs text-muted">Antworten Sie im Chat mit „Ja“, um die Anfrage zu senden.</p>
      ) : null}

      {(step === "name" || step === "phone" || step === "email") && (
        <p className="mt-3 text-xs text-muted">Bitte im Chat-Feld unten antworten.</p>
      )}
    </div>
  );
}
