import { signOut } from "@/app/admin/anmelden/actions";

type AdminHeaderProps = {
  description: string;
  role: string;
  title: string;
};

export function AdminHeader({ description, role, title }: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">{role}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>
      </div>

      <form action={signOut}>
        <button
          className="h-11 rounded-full border border-border px-5 text-sm font-semibold text-foreground transition hover:border-gold hover:text-gold"
          type="submit"
        >
          Abmelden
        </button>
      </form>
    </header>
  );
}
