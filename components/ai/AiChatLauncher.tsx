"use client";

import { useState } from "react";

import { AiChatWindow } from "@/components/ai/AiChatWindow";

function AiChatIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path
          d="m6 6 12 12M18 6 6 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3a7 7 0 0 0-4 12.7V19l2.5-1.2a7 7 0 0 0 1.5.2 7 7 0 1 0 0-14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.5 11h5M9.5 14h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function AiChatLauncher() {
  const [open, setOpen] = useState(false);

  function toggleChat() {
    setOpen((current) => !current);
  }

  return (
    <div
      className="fixed right-[max(1rem,env(safe-area-inset-right))] z-[60] flex flex-col items-end gap-3 bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))] md:bottom-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <AiChatWindow onClose={() => setOpen(false)} open={open} />

      <button
        aria-expanded={open}
        aria-label={open ? "AI Chat schließen" : "AI Chat öffnen"}
        className="touch-press flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-elevated text-gold shadow-luxury transition hover:scale-[1.03] hover:border-gold/50 hover:bg-surface active:scale-95"
        onClick={toggleChat}
        type="button"
      >
        <AiChatIcon open={open} />
      </button>
    </div>
  );
}
