"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";

import {
  initialBookingState,
  submitBookingRequest,
} from "@/app/actions/booking";
import type { DateAvailability, MasterOption } from "@/lib/booking/types";

const inputClassName = "luxury-input mt-2";
const textareaClassName = "luxury-input luxury-textarea mt-2";
const selectClassName =
  "mt-2 h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold disabled:opacity-60";

type ContactFormProps = {
  masters: MasterOption[];
  whatsappUrl: string;
};

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function ContactForm({ masters: initialMasters, whatsappUrl }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitBookingRequest,
    initialBookingState,
  );
  const [isLoadingSlots, startTransition] = useTransition();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [masterId, setMasterId] = useState("");
  const [availability, setAvailability] = useState<DateAvailability | null>(null);
  const [availabilityNotice, setAvailabilityNotice] = useState("");

  const minDate = getTodayIso();

  useEffect(() => {
    if (!date) {
      setAvailability(null);
      setTime("");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/booking/availability?date=${encodeURIComponent(date)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("availability request failed");
        }

        const result = (await response.json()) as DateAvailability | null;
        setAvailability(result);
        setAvailabilityNotice(
          result?.closed && result.closedMessage && result.slots.length === 0
            ? result.closedMessage
            : "",
        );
        setTime((current) => {
          if (current && result?.slots.includes(current)) {
            return current;
          }
          return "";
        });
      } catch {
        setAvailability(null);
        setAvailabilityNotice(
          "Verfügbarkeit konnte nicht geladen werden. Bitte später erneut versuchen oder per WhatsApp buchen.",
        );
        setTime("");
      }
    });
  }, [date]);

  useEffect(() => {
    if (state.suggestedMasterId) {
      setMasterId(state.suggestedMasterId);
    }
  }, [state.suggestedMasterId]);

  const masters = availability?.masters.length ? availability.masters : initialMasters;

  const availableMastersForTime = useMemo(() => {
    if (!availability || !time) {
      return masters;
    }

    return masters.filter((master) =>
      availability.availabilityByMaster[master.id]?.includes(time),
    );
  }, [availability, masters, time]);

  useEffect(() => {
    if (!time || !masterId) {
      return;
    }

    const stillAvailable = availableMastersForTime.some((master) => master.id === masterId);

    if (!stillAvailable) {
      const autoMaster = availableMastersForTime[0];

      if (autoMaster) {
        setMasterId(autoMaster.id);
      } else {
        setMasterId("");
      }
    }
  }, [time, masterId, availableMastersForTime]);

  const masterHint =
    time && availableMastersForTime.length > 0
      ? `Verfügbar um ${time}: ${availableMastersForTime.map((master) => master.name).join(", ")}`
      : time
        ? "Zu dieser Uhrzeit ist kein Meister frei – bitte andere Zeit wählen."
        : "Wählen Sie zuerst Datum und Uhrzeit.";

  return (
    <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-luxury sm:rounded-[2rem] sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold sm:text-xs">
        Terminbuchung
      </p>
      <h3 className="mt-4 text-xl font-semibold tracking-[-0.04em] text-foreground sm:text-2xl">
        Termin anfragen
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">
        Wählen Sie Datum, Uhrzeit und Meister. Belegte Termine werden automatisch blockiert –
        freie Meister werden vorgeschlagen.
      </p>

      {state.success ? (
        <p className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
          Vielen Dank. Ihre Terminanfrage wurde gespeichert. Wir bestätigen den Termin in Kürze per
          Telefon oder Nachricht.
        </p>
      ) : null}

      {state.error ? (
        <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      {availabilityNotice ? (
        <p className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
          {availabilityNotice}
        </p>
      ) : null}

      <form action={formAction} className="mt-8 space-y-5">
        <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />

        <label className="block text-sm font-medium text-foreground">
          Datum *
          <input
            className={inputClassName}
            disabled={isPending}
            min={minDate}
            name="appointment_date"
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </label>

        <label className="block text-sm font-medium text-foreground">
          Uhrzeit *
          <select
            className={selectClassName}
            disabled={isPending || !date || isLoadingSlots || availability?.closed}
            name="appointment_time"
            onChange={(event) => setTime(event.target.value)}
            required
            value={time}
          >
            <option value="">
              {isLoadingSlots
                ? "Verfügbarkeit wird geladen…"
                : availability?.closed
                  ? "Geschlossen"
                  : "Uhrzeit wählen"}
            </option>
            {availability?.slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot} Uhr
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-foreground">
          Meister *
          <select
            className={selectClassName}
            disabled={isPending || !time || availableMastersForTime.length === 0}
            name="master_id"
            onChange={(event) => setMasterId(event.target.value)}
            required
            value={masterId}
          >
            <option value="">
              {time ? "Meister wählen" : "Zuerst Uhrzeit wählen"}
            </option>
            {masters.map((master) => {
              const isAvailable = !time || availableMastersForTime.some((item) => item.id === master.id);

              return (
                <option disabled={!isAvailable} key={master.id} value={master.id}>
                  {master.name}
                  {master.title ? ` – ${master.title}` : ""}
                  {!isAvailable && time ? " (belegt)" : ""}
                </option>
              );
            })}
          </select>
          <span className="mt-2 block text-xs text-muted">{masterHint}</span>
        </label>

        <label className="block text-sm font-medium text-foreground">
          Name *
          <input className={inputClassName} disabled={isPending} name="name" required type="text" />
        </label>

        <label className="block text-sm font-medium text-foreground">
          Telefon *
          <input
            className={inputClassName}
            disabled={isPending}
            inputMode="tel"
            name="phone"
            required
            type="tel"
          />
        </label>

        <label className="block text-sm font-medium text-foreground">
          E-Mail *
          <input
            autoComplete="email"
            className={inputClassName}
            disabled={isPending}
            inputMode="email"
            name="email"
            required
            type="email"
          />
        </label>

        <label className="block text-sm font-medium text-foreground">
          Nachricht
          <textarea
            className={textareaClassName}
            disabled={isPending}
            name="message"
            placeholder="Service, Wünsche oder Fragen (optional)"
          />
        </label>

        <button
          className="touch-press inline-flex min-h-14 w-full touch-manipulation items-center justify-center rounded-full border border-gold bg-gold px-8 text-sm font-semibold uppercase tracking-[0.22em] text-black transition active:scale-[0.98] hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending || isLoadingSlots || !time || availableMastersForTime.length === 0}
          type="submit"
        >
          {isPending ? "Wird gesendet…" : "Termin anfragen"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-muted">
        Oder direkt per{" "}
        <a
          className="font-semibold text-gold transition hover:text-gold-soft"
          href={whatsappUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
      </p>
    </div>
  );
}
