"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";

import type { DateAvailability, MasterOption } from "@/lib/booking/types";

type AiBookingInlineProps = {
  masters: MasterOption[];
  onClose: () => void;
  onSuccess: () => void;
  whatsappUrl: string;
};

type BookingFormState = {
  error: string;
  success: boolean;
  suggestedMasterId?: string;
};

const initialBookingState: BookingFormState = {
  error: "",
  success: false,
};

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-gold";
const selectClassName =
  "mt-1.5 h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-gold disabled:opacity-60";

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function AiBookingInline({ masters: initialMasters, onClose, onSuccess, whatsappUrl }: AiBookingInlineProps) {
  const [state, setState] = useState<BookingFormState>(initialBookingState);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          "Verfügbarkeit konnte nicht geladen werden. Bitte später erneut versuchen.",
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

  function handleBookingSuccess() {
    onSuccess();
    setState(initialBookingState);
    setDate("");
    setTime("");
    setMasterId("");
    setAvailability(null);
    setAvailabilityNotice("");
  }

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
    if (!time) {
      return;
    }

    const autoMaster = availableMastersForTime[0];

    if (!masterId) {
      setMasterId(autoMaster?.id ?? "");
      return;
    }

    if (!availableMastersForTime.some((master) => master.id === masterId)) {
      setMasterId(autoMaster?.id ?? "");
    }
  }, [time, masterId, availableMastersForTime]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setState(initialBookingState);

    try {
      const response = await fetch("/api/booking/request", {
        body: formData,
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("booking request failed");
      }

      const result = (await response.json()) as BookingFormState;

      if (result.success) {
        form.reset();
        handleBookingSuccess();
        return;
      }

      setState(result);
    } catch {
      setState({
        error:
          "Die Buchung konnte nicht verarbeitet werden. Bitte erneut versuchen oder per WhatsApp buchen.",
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gold/25 bg-surface-elevated p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
            Online-Termin
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">Termin direkt im Chat buchen</p>
        </div>
        <button
          aria-label="Terminbuchung schließen"
          className="touch-press flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted transition hover:border-gold hover:text-gold"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {state.error}
        </p>
      ) : null}

      {availabilityNotice ? (
        <p className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold-soft">
          {availabilityNotice}
        </p>
      ) : null}

      <form className="mt-4 max-h-[min(52vh,28rem)] space-y-3 overflow-y-auto overscroll-contain pr-1" onSubmit={handleSubmit}>
        <input autoComplete="off" className="hidden" name="website" tabIndex={-1} type="text" />

        <label className="block text-xs font-medium text-foreground">
          Datum *
          <input
            className={inputClassName}
            disabled={isSubmitting}
            min={minDate}
            name="appointment_date"
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </label>

        <label className="block text-xs font-medium text-foreground">
          Uhrzeit *
          <select
            className={selectClassName}
            disabled={isSubmitting || !date || isLoadingSlots || availability?.closed}
            name="appointment_time"
            onChange={(event) => setTime(event.target.value)}
            required
            value={time}
          >
            <option value="">
              {isLoadingSlots ? "Lädt…" : availability?.closed ? "Geschlossen" : "Uhrzeit wählen"}
            </option>
            {availability?.slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot} Uhr
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-medium text-foreground">
          Meister *
          <select
            className={selectClassName}
            disabled={isSubmitting || !time || availableMastersForTime.length === 0}
            name="master_id"
            onChange={(event) => setMasterId(event.target.value)}
            required
            value={masterId}
          >
            <option value="">{time ? "Meister wählen" : "Zuerst Uhrzeit"}</option>
            {masters.map((master) => {
              const isAvailable =
                !time || availableMastersForTime.some((item) => item.id === master.id);

              return (
                <option disabled={!isAvailable} key={master.id} value={master.id}>
                  {master.name}
                  {master.title ? ` – ${master.title}` : ""}
                </option>
              );
            })}
          </select>
        </label>

        <label className="block text-xs font-medium text-foreground">
          Name *
          <input className={inputClassName} disabled={isSubmitting} name="name" required type="text" />
        </label>

        <label className="block text-xs font-medium text-foreground">
          Telefon *
          <input
            className={inputClassName}
            disabled={isSubmitting}
            inputMode="tel"
            name="phone"
            required
            type="tel"
          />
        </label>

        <label className="block text-xs font-medium text-foreground">
          E-Mail *
          <input
            className={inputClassName}
            disabled={isSubmitting}
            inputMode="email"
            name="email"
            required
            type="email"
          />
        </label>

        <label className="block text-xs font-medium text-foreground">
          Nachricht
          <textarea
            className={`${inputClassName} min-h-20 resize-none`}
            disabled={isSubmitting}
            name="message"
            placeholder="Optional: Service oder Wünsche"
          />
        </label>

        <button
          className="touch-press inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold bg-gold px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
          disabled={
            isSubmitting ||
            isLoadingSlots ||
            !date ||
            !time ||
            !masterId ||
            availableMastersForTime.length === 0
          }
          type="submit"
        >
          {isSubmitting ? "Wird gesendet…" : "Termin anfragen"}
        </button>
      </form>

      <p className="mt-3 text-center text-[10px] text-muted">
        Oder per{" "}
        <a className="text-gold hover:text-gold-soft" href={whatsappUrl} rel="noreferrer" target="_blank">
          WhatsApp
        </a>
      </p>
    </div>
  );
}
