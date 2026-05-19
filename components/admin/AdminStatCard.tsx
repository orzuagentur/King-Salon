type AdminStatCardProps = {
  label: string;
  value: number | string;
  hint?: string;
};

export function AdminStatCard({ hint, label, value }: AdminStatCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-luxury">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground">{value}</p>
      {hint ? <p className="mt-2 text-xs leading-5 text-muted">{hint}</p> : null}
    </article>
  );
}
