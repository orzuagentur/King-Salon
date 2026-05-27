"use client";

import { motion } from "framer-motion";

import { AiStructuredRenderer } from "@/components/ai/structured/AiStructuredRenderer";
import { formatChatTime } from "@/lib/ai/format";
import type { AiChatMessage } from "@/lib/ai/types";

type AiChatMessageBubbleProps = {
  message: AiChatMessage;
  onBook?: () => void;
  onRetry?: (messageId: string) => void;
};

export function AiChatMessageBubble({ message, onBook, onRetry }: AiChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isStreaming = message.status === "streaming" && !message.content;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={
          isUser
            ? "max-w-[min(85%,42rem)] rounded-[1.25rem] rounded-br-md border border-[var(--ai-accent)]/25 bg-[var(--ai-accent)]/10 px-4 py-3 text-sm leading-6 text-foreground"
            : `max-w-[min(92%,44rem)] rounded-[1.25rem] rounded-bl-md border px-4 py-3 text-sm leading-6 text-foreground ${
                isError
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-border bg-surface-elevated"
              }`
        }
      >
        {isStreaming ? (
          <div aria-hidden="true" className="space-y-2 py-0.5">
            <div className="h-2.5 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-2.5 w-56 animate-pulse rounded-full bg-white/10" />
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap break-words">{message.structured?.text ?? message.content}</p>
            {!isUser ? (
              <AiStructuredRenderer blocks={message.structured?.blocks} onBook={onBook} />
            ) : null}
          </>
        )}
      </div>

      <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : ""}`}>
        <time
          className="text-[10px] uppercase tracking-[0.2em] text-muted"
          dateTime={message.createdAt}
        >
          {formatChatTime(message.createdAt)}
        </time>
        {isError && onRetry ? (
          <button
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition hover:text-gold-soft"
            onClick={() => onRetry(message.id)}
            type="button"
          >
            Erneut
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
