import type { Metadata } from "next";

import { signIn } from "@/app/admin/anmelden/actions";

export const metadata: Metadata = {
  title: "Admin Anmeldung | King Salon Celle",
  description: "Geschuetzter Admin-Zugang fuer King Salon Celle.",
};

type LoginPageProps = {
  searchParams: Promise<{
    fehler?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { fehler } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-12 text-foreground">
      <section className="w-full max-w-md rounded-[2rem] border border-border bg-surface/90 p-6 shadow-luxury backdrop-blur sm:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
          King Salon Celle
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          Admin Anmeldung
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Melden Sie sich an, um Inhalte, Preise, Galerie und Salon-Daten sicher zu verwalten.
        </p>

        {fehler ? (
          <p className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-soft">
            {fehler}
          </p>
        ) : null}

        <form action={signIn} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-foreground">
            E-Mail
            <input
              autoComplete="email"
              className="mt-2 h-12 w-full rounded-full border border-border bg-background px-5 text-foreground outline-none transition focus:border-gold"
              name="email"
              placeholder="admin@kingsalon.de"
              required
              type="email"
            />
          </label>

          <label className="block text-sm font-medium text-foreground">
            Passwort
            <input
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-full border border-border bg-background px-5 text-foreground outline-none transition focus:border-gold"
              name="password"
              placeholder="Ihr Passwort"
              required
              type="password"
            />
          </label>

          <button
            className="h-12 w-full rounded-full bg-gold px-6 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-gold-soft"
            type="submit"
          >
            Anmelden
          </button>
        </form>
      </section>
    </main>
  );
}
