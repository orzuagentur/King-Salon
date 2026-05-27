"use client";

import { motion } from "framer-motion";

export function AiTypingIndicator() {
  return (
    <div
      aria-label="Assistent schreibt"
      className="flex max-w-[85%] items-center gap-1.5 rounded-[1.25rem] border border-border bg-surface-elevated px-4 py-3"
      role="status"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          className="h-1.5 w-1.5 rounded-full bg-gold"
          key={index}
          transition={{
            duration: 0.9,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}
