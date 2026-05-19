import { updateOpeningHours } from "@/app/admin/(dashboard)/oeffnungszeiten/actions";
import { weekDays } from "@/lib/opening-hours/defaults";
import type { OpeningHoursEntry } from "@/lib/opening-hours/types";

type OpeningHoursFormProps = {
  openingHours: OpeningHoursEntry[];
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function OpeningHoursForm({ openingHours }: OpeningHoursFormProps) {
  const hoursByDay = new Map(openingHours.map((entry) => [entry.day, entry.hours]));

  return (
    <form
      action={updateOpeningHours}
      className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Öffnungszeiten</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        Wochenplan bearbeiten
      </h2>
      <p className="mt-2 text-sm text-muted">
        Format: „09:00 - 19:00“ oder „Geschlossen“ für geschlossene Tage.
      </p>

      <div className="mt-6 space-y-4">
        {weekDays.map((day) => (
          <label className={labelClassName} key={day}>
            {day}
            <input
              className={inputClassName}
              defaultValue={hoursByDay.get(day) ?? "Geschlossen"}
              name={`hours_${day}`}
              placeholder="09:00 - 19:00"
              required
              type="text"
            />
          </label>
        ))}
      </div>

      <button
        className="mt-6 h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
        type="submit"
      >
        Öffnungszeiten speichern
      </button>
    </form>
  );
}
