"use client";

import { deleteBooking, updateBookingStatus } from "@/app/admin/(dashboard)/termine/actions";
import { AdminSubmitButton } from "@/components/admin/AdminSubmitButton";
import type { Booking } from "@/lib/data/bookings";

type BookingsManagerProps = {
  bookings: Booking[];
};

const statusLabels: Record<Booking["status"], string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
};

const statusStyles: Record<Booking["status"], string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  confirmed: "border-gold/30 bg-gold/10 text-gold-soft",
  cancelled: "border-border bg-background text-muted",
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
};

function formatDate(dateIso: string) {
  return new Date(`${dateIso}T12:00:00`).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeValue: string) {
  return timeValue.slice(0, 5);
}

export function BookingsManager({ bookings }: BookingsManagerProps) {
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {bookings.length} Termin{bookings.length === 1 ? "" : "e"} gesamt
          {pendingCount > 0 ? ` · ${pendingCount} ausstehend` : ""}
        </p>
      </div>

      {bookings.length === 0 ? (
        <p className="rounded-[1.75rem] border border-border bg-surface-elevated p-6 text-sm text-muted">
          Noch keine Terminanfragen. Neue Buchungen erscheinen hier automatisch.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              className="rounded-[1.75rem] border border-border bg-surface-elevated p-5 sm:p-6"
              key={booking.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{booking.customer_name}</h2>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${statusStyles[booking.status]}`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gold-soft">
                    {formatDate(booking.appointment_date)} · {formatTime(booking.appointment_time)} Uhr
                    {booking.masters?.name ? ` · ${booking.masters.name}` : ""}
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted">Telefon</dt>
                      <dd>
                        <a className="text-foreground hover:text-gold" href={`tel:${booking.customer_phone}`}>
                          {booking.customer_phone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">E-Mail</dt>
                      <dd>
                        <a
                          className="break-all text-foreground hover:text-gold"
                          href={`mailto:${booking.customer_email}`}
                        >
                          {booking.customer_email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  {booking.message ? (
                    <p className="mt-4 text-sm leading-6 text-muted">{booking.message}</p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <form action={updateBookingStatus} className="flex gap-2">
                    <input name="id" type="hidden" value={booking.id} />
                    <select
                      className="h-10 min-w-[10rem] rounded-full border border-border bg-background px-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground outline-none focus:border-gold"
                      defaultValue={booking.status}
                      name="status"
                    >
                      <option value="pending">Ausstehend</option>
                      <option value="confirmed">Bestätigt</option>
                      <option value="cancelled">Storniert</option>
                      <option value="completed">Abgeschlossen</option>
                    </select>
                    <AdminSubmitButton className="h-10 shrink-0 px-4 tracking-[0.2em]">
                      Speichern
                    </AdminSubmitButton>
                  </form>
                  <form action={deleteBooking}>
                    <input name="id" type="hidden" value={booking.id} />
                    <AdminSubmitButton
                      className="h-10 w-full tracking-[0.2em] sm:w-auto"
                      loadingLabel="Wird gelöscht…"
                      onClick={(event) => {
                        if (!window.confirm("Diesen Termin wirklich löschen?")) {
                          event.preventDefault();
                        }
                      }}
                      variant="danger"
                    >
                      Löschen
                    </AdminSubmitButton>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
