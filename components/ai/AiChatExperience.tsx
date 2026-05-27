"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";

import { AiAgentAvatar } from "@/components/ai/AiAgentAvatar";
import { AiBookingStepPanel } from "@/components/ai/AiBookingStepPanel";
import { AiChatComposer } from "@/components/ai/AiChatComposer";
import { AiChatMessages } from "@/components/ai/AiChatMessages";
import { useAiChat } from "@/lib/ai/chat/use-ai-chat";
import { isBookingIntent, useAiBookingFlow } from "@/lib/ai/chat/use-ai-booking-flow";
import { useVisualViewportOffset } from "@/lib/ai/chat/use-visual-viewport";
import type { AiAgentConfig } from "@/lib/ai/agent/types";
import type { AiBookingModePayload } from "@/lib/ai/booking/types";

type AiChatExperienceProps = {
  agent: AiAgentConfig;
};

export function AiChatExperience({ agent }: AiChatExperienceProps) {
  useVisualViewportOffset();

  const bookingModeRef = useRef<AiBookingModePayload | undefined>(undefined);

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
  } = useAiChat({
    agent,
    getBookingMode: () => bookingModeRef.current,
  });

  const bookingFlow = useAiBookingFlow({
    onBooked: (message) => appendAssistantMessage(message),
    onStepMessage: (message) => appendAssistantMessage(message),
  });

  bookingModeRef.current = bookingFlow.active
    ? { active: true, step: bookingFlow.step, draft: bookingFlow.draft }
    : undefined;

  useEffect(() => {
    document.body.dataset.aiChatPage = "true";
    document.body.style.overflow = "hidden";

    return () => {
      delete document.body.dataset.aiChatPage;
      document.body.style.overflow = "";
    };
  }, []);

  const handleSend = useCallback(
    async (value: string) => {
      const content = value.trim();
      if (!content) {
        return;
      }

      if (isBookingIntent(content) && !bookingFlow.active) {
        bookingFlow.start();
        await sendMessage(content, { skipAi: true });
        return;
      }

      const bookingHandled = await bookingFlow.processUserInput(content);

      if (bookingHandled) {
        await sendMessage(content, { skipAi: true });
        return;
      }

      await sendMessage(content);
    },
    [bookingFlow, sendMessage],
  );

  function handleInputChange(value: string) {
    setInput(value);
    if (error) {
      setError(null);
    }
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
                  className={`h-1.5 w-1.5 rounded-full ${isTyping || bookingFlow.isProcessing ? "animate-pulse bg-[var(--ai-accent)]" : "bg-emerald-400"}`}
                />
                {isTyping || bookingFlow.isProcessing ? "Schreibt…" : "Online"}
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
            isTyping={isTyping}
            messages={messages}
            onBook={() => bookingFlow.start()}
            onRetry={(messageId) => {
              void retryMessage(messageId);
            }}
          />
        )}

        {bookingFlow.active ? (
          <AiBookingStepPanel
            availability={bookingFlow.availability}
            fieldError={bookingFlow.fieldError}
            selectedTime={bookingFlow.draft.appointment_time}
            onCancel={bookingFlow.reset}
            onSelectDate={(dateIso) => {
              void bookingFlow.selectDate(dateIso);
            }}
            onSelectMaster={(masterId) => {
              void bookingFlow.selectMaster(masterId);
            }}
            onSelectTime={(time) => {
              void bookingFlow.selectTime(time);
            }}
            step={bookingFlow.step}
          />
        ) : null}

        <AiChatComposer
          disabled={isTyping || bookingFlow.isProcessing || !hydrated}
          error={error}
          isLoading={isTyping || bookingFlow.isProcessing}
          onChange={handleInputChange}
          onDismissError={() => setError(null)}
          onSend={(value) => {
            void handleSend(value);
          }}
          value={input}
        />
      </main>
    </div>
  );
}
