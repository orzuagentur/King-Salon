"use client";

import Link from "next/link";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminDashboardError({ error, reset }: AdminErrorProps) {
  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-border bg-surface p-8 text-center shadow-luxury">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Admin</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">Etwas ist schiefgelaufen</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Das Dashboard konnte nicht geladen werden. Prüfen Sie Supabase (admins-Tabelle, UUID) und
        Vercel-Umgebungsvariablen.
      </p>
      {error.message ? (
        <p className="mt-4 rounded-2xl border border-border bg-background px-4 py-3 text-left text-xs text-muted">
          {error.message}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          className="h-11 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.24em] text-black"
          onClick={reset}
          type="button"
        >
          Erneut versuchen
        </button>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-xs font-semibold uppercase tracking-[0.24em] text-foreground"
          href="/admin/anmelden"
        >
          Zur Anmeldung
        </Link>
      </div>
    </div>
  );
}
