type AdminAlertProps = {
  message?: string;
  type: "success" | "error";
};

export function AdminAlert({ message, type }: AdminAlertProps) {
  if (!message) {
    return null;
  }

  const styles =
    type === "success"
      ? "border-gold/30 bg-gold/10 text-gold-soft"
      : "border-red-500/30 bg-red-500/10 text-red-200";

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm ${styles}`} role="status">
      {message}
    </p>
  );
}
