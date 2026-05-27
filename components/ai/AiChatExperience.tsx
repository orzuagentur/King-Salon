"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { AiAgentAvatar } from "@/components/ai/AiAgentAvatar";
import { AiChatComposer } from "@/components/ai/AiChatComposer";
import { AiChatMessages } from "@/components/ai/AiChatMessages";
import { useAiChat } from "@/lib/ai/chat/use-ai-chat";
import { useVisualViewportOffset } from "@/lib/ai/chat/use-visual-viewport";
import type { AiAgentConfig } from "@/lib/ai/agent/types";
import type { MasterOption } from "@/lib/booking/types";

const AiBookingInline = dynamic(
  () => import("@/components/ai/AiBookingInline").then((module) => module.AiBookingInline),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto h-24 w-full max-w-3xl animate-pulse rounded-2xl border border-border bg-surface-elevated" />
    ),
  },
);

type AiChatExperienceProps = {
  agent: AiAgentConfig;
  masters: MasterOption[];
  whatsappUrl: string;
};

export function AiChatExperience({ agent, masters, whatsappUrl }: AiChatExperienceProps) {
  const [showBooking, setShowBooking] = useState(false);
  useVisualViewportOffset();

  const openBooking = useCallback(() => {
    setShowBooking(true);
  }, []);

  const {
    messages,
    input,
    isTyping,
    error,
    hydrated,
    setInput,
    setError,
    sendMessage,
    retryMessage,
    appendAssistantMessage,
  } = useAiChat({ agent, onOpenBooking: openBooking });

  useEffect(() => {
    document.body.dataset.aiChatPage = "true";
    document.body.style.overflow = "hidden";

    return () => {
      delete document.body.dataset.aiChatPage;
      document.body.style.overflow = "";
    };
  }, []);

  function handleInputChange(value: string) {
    setInput(value);
    if (error) {
      setError(null);
    }
  }

  function handleBookingSuccess() {
    appendAssistantMessage(
      "Ihre Terminanfrage wurde gesendet. Wir melden uns in Kürze zur Bestätigung — vielen Dank!",
    );
    setShowBooking(false);
  }

  const themeStyle = {
    "--ai-accent": agent.themeColor,
  } as CSSProperties;

  return (
    <div className="ai-chat-shell flex h-dvh flex-col bg-background" style={themeStyle}>
      <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <AiAgentAvatar avatar={agent.agentAvatar} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
                {agent.agentName}
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${isTyping ? "animate-pulse bg-[var(--ai-accent)]" : "bg-emerald-400"}`}
                />
                {isTyping ? "Schreibt…" : "Online"}
              </p>
            </div>
          </div>
          <Link
            className="touch-press shrink-0 rounded-full border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted transition hover:border-[var(--ai-accent)] hover:text-[var(--ai-accent)]"
            href="/"
          >
            Schließen
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        {!hydrated ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <span
              aria-hidden="true"
              className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-[var(--ai-accent)]"
            />
            <span className="sr-only">Chat wird geladen</span>
          </div>
        ) : (
          <AiChatMessages
            isTyping={false}
            messages={messages}
            onBook={openBooking}
            onRetry={(messageId) => {
              void retryMessage(messageId);
            }}
          />
        )}

        <AnimatePresence initial={false}>
          {showBooking ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 px-4 pb-2 sm:px-6"
              exit={{ opacity: 0, y: 8 }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              <AiBookingInline
                masters={masters}
                onClose={() => setShowBooking(false)}
                onSuccess={handleBookingSuccess}
                whatsappUrl={whatsappUrl}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AiChatComposer
          disabled={isTyping || !hydrated}
          error={error}
          isLoading={isTyping}
          onChange={handleInputChange}
          onDismissError={() => setError(null)}
          onSend={(value) => {
            void sendMessage(value);
          }}
          value={input}
        />
      </main>
    </div>
  );
}
