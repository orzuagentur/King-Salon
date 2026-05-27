"use client";

import { motion } from "framer-motion";

import type { AiChatMessage } from "@/lib/ai/types";
import { formatChatTime } from "@/lib/ai/format";

type AiChatMessageProps = {
  message: AiChatMessage;
};

export function AiChatMessageBubble({ message }: AiChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistantSkeleton = !isUser && message.content.trim().length === 0;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-[1.25rem] rounded-br-md border border-gold/25 bg-gold/10 px-4 py-3 text-sm leading-6 text-foreground"
            : "max-w-[85%] rounded-[1.25rem] rounded-bl-md border border-border bg-surface-elevated px-4 py-3 text-sm leading-6 text-foreground"
        }
      >
        {isAssistantSkeleton ? (
          <div aria-hidden="true" className="space-y-2 py-0.5">
            <div className="h-2.5 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-2.5 w-28 animate-pulse rounded-full bg-white/10" />
          </div>
        ) : (
          message.content
        )}
      </div>
      <time
        className="px-1 text-[10px] uppercase tracking-[0.2em] text-muted"
        dateTime={message.createdAt}
      >
        {formatChatTime(message.createdAt)}
      </time>
    </motion.div>
  );
}
