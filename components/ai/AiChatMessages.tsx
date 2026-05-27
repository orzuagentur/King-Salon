"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { AiChatMessageBubble } from "@/components/ai/AiChatMessage";
import { AiTypingIndicator } from "@/components/ai/AiTypingIndicator";
import type { AiChatMessage } from "@/lib/ai/types";

type AiChatMessagesProps = {
  isTyping: boolean;
  messages: AiChatMessage[];
};

export function AiChatMessages({ isTyping, messages }: AiChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4 sm:px-5"
      ref={scrollRef}
      style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
    >
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <AiChatMessageBubble key={message.id} message={message} />
        ))}
        <AnimatePresence initial={false}>
          {isTyping ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              initial={{ opacity: 0, y: 6 }}
              key="typing-indicator"
              transition={{ duration: 0.2 }}
            >
              <AiTypingIndicator />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
