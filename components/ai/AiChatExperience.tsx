"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AiBookingInline } from "@/components/ai/AiBookingInline";
import { AiChatComposer } from "@/components/ai/AiChatComposer";
import { AiChatMessages } from "@/components/ai/AiChatMessages";
import { AiChatQuickActions } from "@/components/ai/AiChatQuickActions";
import { AiSparkIcon } from "@/components/ai/AiSparkIcon";
import { sendChatToApi } from "@/lib/ai/chat-client";
import { createMessageId } from "@/lib/ai/format";
import type { MasterOption } from "@/lib/booking/types";
import type { AiChatMessage } from "@/lib/ai/types";

const WELCOME_MESSAGE: AiChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Willkommen bei King Salon Celle. Ich helfe bei Leistungen, Preisen und Öffnungszeiten — und Sie können hier direkt einen Termin buchen.",
  createdAt: new Date().toISOString(),
};

type AiChatExperienceProps = {
  masters: MasterOption[];
  siteName?: string;
  whatsappUrl: string;
};

function isBookingIntent(text: string) {
  return /(termin|buchen|buchung|reservier|appointment|uhrzeit.*frei)/i.test(text);
}

export function AiChatExperience({ masters, siteName = "King Salon", whatsappUrl }: AiChatExperienceProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const appendAssistantMessage = useCallback((content: string) => {
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const openBooking = useCallback(() => {
    setShowBooking(true);
    appendAssistantMessage(
      "Gerne — hier können Sie Ihren Termin direkt anfragen. Wählen Sie Datum, Uhrzeit und Meister.",
    );
  }, [appendAssistantMessage]);

  const handleSend = useCallback(
    async (rawValue: string) => {
      const content = rawValue.trim();

      if (!content || isTyping) {
        return;
      }

      if (isBookingIntent(content)) {
        openBooking();
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
    [isTyping, messages, openBooking],
  );

  function handleQuickPrompt(text: string) {
    void handleSend(text);
  }

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

  const lastMessage = messages.at(-1);
  const showTypingIndicator =
    isTyping && lastMessage?.role === "assistant" && !lastMessage.content;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
              <AiSparkIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">
                {siteName} KI-Assistent
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${isTyping ? "animate-pulse bg-gold" : "bg-emerald-400"}`}
                />
                {isTyping ? "Schreibt…" : "Online · Terminbuchung aktiv"}
              </p>
            </div>
          </div>
          <Link
            className="touch-press shrink-0 rounded-full border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted transition hover:border-gold hover:text-gold"
            href="/"
          >
            Zur Website
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
        <AiChatMessages isTyping={showTypingIndicator} messages={messages} />

        <AnimatePresence initial={false}>
          {showBooking ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 px-4 pb-3 sm:px-6"
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

        <div className="shrink-0 space-y-3 border-t border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
          <AiChatQuickActions
            disabled={isTyping}
            onBook={openBooking}
            onPrompt={handleQuickPrompt}
          />
          <AiChatComposer
            disabled={isTyping}
            error={error}
            isLoading={isTyping}
            onChange={handleInputChange}
            onDismissError={() => setError(null)}
            onSend={handleSend}
            value={input}
          />
        </div>
      </main>
    </div>
  );
}
