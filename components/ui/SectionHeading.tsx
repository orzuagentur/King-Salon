type SectionHeadingProps = {
  eyebrow: string;
  subtitle: string;
  title: string;
};

export function SectionHeading({ eyebrow, subtitle, title }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold sm:mb-4 sm:text-xs sm:tracking-[0.38em]">
        {eyebrow}
      </p>
      <h2 className="luxury-section-title font-semibold text-foreground">{title}</h2>
      <p className="mt-4 max-w-prose text-[0.95rem] leading-7 text-muted sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
        {subtitle}
      </p>
    </div>
  );
}
