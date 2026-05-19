import type { AnchorHTMLAttributes, ReactNode } from "react";

type LuxuryButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function LuxuryButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: LuxuryButtonProps) {
  const variantClass =
    variant === "primary"
      ? "border-gold bg-gold text-black hover:bg-gold-soft"
      : "border-border bg-white/5 text-foreground hover:border-gold hover:text-gold";

  return (
    <a
      className={`touch-press inline-flex min-h-14 w-full touch-manipulation items-center justify-center rounded-full border px-8 text-center text-sm font-semibold uppercase tracking-[0.22em] transition duration-200 ease-out active:scale-[0.98] sm:min-h-12 sm:w-auto sm:px-6 sm:text-xs sm:tracking-[0.24em] ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
