import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { Service } from "@/lib/data/services";

type ServiceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  onCancel?: () => void;
  service?: Service;
  submitLabel: string;
  title: string;
};

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-gold";

const labelClassName = "block text-sm font-medium text-foreground";

export function ServiceForm({ action, onCancel, service, submitLabel, title }: ServiceFormProps) {
  return (
    <form action={action} className="rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">{title}</p>

      {service ? <input name="id" type="hidden" value={service.id} /> : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className={labelClassName}>
          Titel *
          <input
            className={inputClassName}
            defaultValue={service?.title ?? ""}
            name="title"
            placeholder="z. B. Fade Cut"
            required
            type="text"
          />
        </label>

        <label className={labelClassName}>
          Preis (EUR) *
          <input
            className={inputClassName}
            defaultValue={service?.price?.toString() ?? ""}
            min="0"
            name="price"
            placeholder="0.00"
            required
            step="0.01"
            type="number"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Beschreibung *
          <textarea
            className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold"
            defaultValue={service?.description ?? ""}
            name="description"
            placeholder="Kurze Beschreibung der Leistung"
            required
          />
        </label>

        <label className={labelClassName}>
          Dauer
          <input
            className={inputClassName}
            defaultValue={service?.duration ?? ""}
            name="duration"
            placeholder="z. B. 45 Min"
            type="text"
          />
        </label>

        <label className={labelClassName}>
          Sortierung
          <input
            className={inputClassName}
            defaultValue={service?.sort_order?.toString() ?? "0"}
            name="sort_order"
            type="number"
          />
        </label>

        <label className={`${labelClassName} sm:col-span-2`}>
          Bild-URL
          <input
            className={inputClassName}
            defaultValue={service?.image ?? ""}
            name="image"
            placeholder="/images/barber-haarschnitt.png"
            type="text"
          />
        </label>

        <label className="flex items-center gap-3 sm:col-span-2">
          <input
            className="h-4 w-4 rounded border-border bg-background accent-gold"
            defaultChecked={service?.active ?? true}
            name="active"
            type="checkbox"
          />
          <span className="text-sm text-foreground">Leistung auf der Website anzeigen</span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <AdminSubmitButton>{submitLabel}</AdminSubmitButton>
        {onCancel ? (
          <button
            className="h-11 rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground transition hover:border-gold hover:text-gold"
            onClick={onCancel}
            type="button"
          >
            Abbrechen
          </button>
        ) : null}
      </div>
    </form>
  );
}
