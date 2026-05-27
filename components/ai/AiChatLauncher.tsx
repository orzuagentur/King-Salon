"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { AiSparkIcon } from "@/components/ai/AiSparkIcon";

type AiChatLauncherProps = {
  contactDockOpen?: boolean;
};

export function AiChatLauncher({ contactDockOpen = false }: AiChatLauncherProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={`ai-chat-launcher fixed z-[60] right-[max(1rem,env(safe-area-inset-right))] transition-[bottom] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:bottom-[max(1rem,env(safe-area-inset-bottom))] ${
        contactDockOpen
          ? "bottom-[max(9.5rem,calc(env(safe-area-inset-bottom)+8.5rem))]"
          : "bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))]"
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        aria-label="KI-Assistent öffnen"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-surface-elevated text-gold shadow-luxury transition duration-300 hover:scale-105 hover:border-gold/70 active:scale-95"
        href="/ki-assistent"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gold/20 opacity-70 blur-md transition group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-gold/20 animate-pulse [animation-duration:2.8s]"
        />
        <AiSparkIcon className="relative h-6 w-6" />
      </Link>
    </motion.div>
  );
}
