type AdminPlaceholderProps = {
  message: string;
  title: string;
};

export function AdminPlaceholder({ message, title }: AdminPlaceholderProps) {
  return (
    <section className="rounded-[2rem] border border-dashed border-border bg-surface/60 p-8 text-center">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{message}</p>
    </section>
  );
}
