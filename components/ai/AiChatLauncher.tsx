"use client";

import Link from "next/link";

import { AiSparkIcon } from "@/components/ai/AiSparkIcon";

export function AiChatLauncher() {
  return (
    <Link
      aria-label="KI-Assistent öffnen"
      className="group fixed right-[max(1rem,env(safe-area-inset-right))] z-[60] bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))] md:bottom-[max(1rem,env(safe-area-inset-bottom))]"
      href="/ki-assistent"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gold/25 blur-xl transition group-hover:bg-gold/35"
      />
      <span className="relative flex h-14 items-center gap-2.5 rounded-full border border-gold/40 bg-surface-elevated pl-3.5 pr-4 text-gold shadow-luxury transition group-hover:scale-[1.03] group-hover:border-gold/60 group-active:scale-95">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15">
          <AiSparkIcon className="h-5 w-5" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-soft">
            KI
          </span>
          <span className="mt-1 text-xs font-semibold tracking-[0.12em] text-foreground">
            Assistent
          </span>
        </span>
      </span>
    </Link>
  );
}
