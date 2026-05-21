"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ToastState = {
  message: string;
  type: "success" | "error";
};

const toastStyles = {
  success: "border-gold/35 bg-surface text-foreground shadow-luxury",
  error: "border-red-500/35 bg-surface text-red-200 shadow-luxury",
};

const iconStyles = {
  success: "text-gold",
  error: "text-red-300",
};

function ToastIcon({ type }: { type: ToastState["type"] }) {
  if (type === "error") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m9 12 2 2 4-4m5 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function AdminToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const successMessage = searchParams.get("erfolg");
    const errorMessage = searchParams.get("fehler");

    if (!successMessage && !errorMessage) {
      return;
    }

    setToast({
      message: successMessage ?? errorMessage ?? "",
      type: successMessage ? "success" : "error",
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("erfolg");
    params.delete("fehler");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-[100] flex justify-end px-[max(1rem,env(safe-area-inset-right))]">
      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            animate={{ opacity: 1, x: 0, y: 0 }}
            aria-live="polite"
            className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 backdrop-blur-xl ${toastStyles[toast.type]}`}
            exit={{ opacity: 0, x: 16, y: -8 }}
            initial={{ opacity: 0, x: 16, y: -8 }}
            key={`${toast.type}-${toast.message}`}
            role="status"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={`mt-0.5 shrink-0 ${iconStyles[toast.type]}`}>
              <ToastIcon type={toast.type} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                {toast.type === "success" ? "Erfolg" : "Fehler"}
              </p>
              <p className="mt-1 text-sm leading-6">{toast.message}</p>
            </div>
            <button
              aria-label="Benachrichtigung schließen"
              className="pointer-events-auto -mr-1 shrink-0 rounded-full p-1 text-muted transition hover:text-foreground"
              onClick={() => setToast(null)}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.6"
                />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
