"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { AiChatComposer } from "@/components/ai/AiChatComposer";
import { AiChatMessages } from "@/components/ai/AiChatMessages";
import { sendChatToApi } from "@/lib/ai/chat-client";
import { createMessageId } from "@/lib/ai/format";
import type { AiChatMessage } from "@/lib/ai/types";

const WELCOME_MESSAGE: AiChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Willkommen bei King Salon Celle. Ich helfe Ihnen bei Fragen zu Leistungen, Preisen, Öffnungszeiten und Terminen.",
  createdAt: new Date().toISOString(),
};

type AiChatWindowProps = {
  onClose: () => void;
  open: boolean;
};

export function AiChatWindow({ onClose, open }: AiChatWindowProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileViewportHeight, setMobileViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const syncViewport = () => {
      const viewport = window.visualViewport;
      const nextHeight = viewport?.height ?? window.innerHeight;
      setMobileViewportHeight(Math.floor(nextHeight));
    };

    syncViewport();
    window.visualViewport?.addEventListener("resize", syncViewport);
    window.visualViewport?.addEventListener("scroll", syncViewport);
    window.addEventListener("orientationchange", syncViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewport);
      window.visualViewport?.removeEventListener("scroll", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
    };
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === "undefined" || window.innerWidth >= 640) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleSend = useCallback(
    async (rawValue: string) => {
      const content = rawValue.trim();

      if (!content || isTyping) {
        return;
      }

      const userMessage: AiChatMessage = {
        id: createMessageId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMessage];
      const assistantId = createMessageId();
      const assistantShell: AiChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      setError(null);
      setMessages([...nextMessages, assistantShell]);
      setInput("");
      setIsTyping(true);

      try {
        const reply = await sendChatToApi({
          messages: nextMessages,
          onStreamChunk: (chunk) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + chunk }
                  : message,
              ),
            );
          },
        });

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: reply } : message,
          ),
        );
      } catch (sendError) {
        setMessages((current) => current.filter((message) => message.id !== assistantId));

        const message =
          sendError instanceof Error
            ? sendError.message
            : "Nachricht konnte nicht gesendet werden. Bitte erneut versuchen.";

        setError(message);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages],
  );

  function handleInputChange(value: string) {
    setInput(value);

    if (error) {
      setError(null);
    }
  }

  const lastMessage = messages.at(-1);
  const showTypingIndicator =
    isTyping && lastMessage?.role === "assistant" && !lastMessage.content;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="King Salon AI Assistent"
          className="mb-1 flex h-[min(32rem,72dvh)] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-luxury sm:h-[32rem] sm:w-[24rem]"
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          role="dialog"
          style={{
            height:
              mobileViewportHeight && mobileViewportHeight < 740
                ? `min(32rem, ${Math.max(380, mobileViewportHeight - 104)}px)`
                : undefined,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
                King Salon Assistent
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${isTyping ? "animate-pulse bg-gold" : "bg-emerald-400"}`}
                />
                {isTyping ? "Schreibt…" : "Online"}
              </p>
            </div>
            <button
              aria-label="Chat schließen"
              className="touch-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition hover:border-gold hover:text-gold"
              onClick={onClose}
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
          </header>

          <AiChatMessages isTyping={showTypingIndicator} messages={messages} />

          <AiChatComposer
            disabled={isTyping}
            error={error}
            isLoading={isTyping}
            onChange={handleInputChange}
            onDismissError={() => setError(null)}
            onSend={handleSend}
            value={input}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
