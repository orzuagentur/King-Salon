"use client";

import { useFormStatus } from "react-dom";

type AdminSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loadingLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary" | "danger";
};

const variantClassName = {
  primary:
    "bg-gold text-black hover:bg-gold-soft disabled:hover:bg-gold",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-gold hover:text-gold",
  danger:
    "border border-red-500/40 bg-transparent text-red-300 hover:border-red-400",
};

export function AdminSubmitButton({
  children,
  className = "",
  disabled = false,
  loadingLabel = "Wird gespeichert…",
  onClick,
  variant = "primary",
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <button
      aria-busy={pending}
      className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-xs font-semibold uppercase tracking-[0.24em] transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClassName[variant]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      type="submit"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
