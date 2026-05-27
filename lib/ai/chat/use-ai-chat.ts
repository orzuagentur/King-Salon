"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { AiAgentConfig } from "@/lib/ai/agent/types";
import { sendChatToApi } from "@/lib/ai/chat-client";
import { clearChatSession, loadChatSession, saveChatSession } from "@/lib/ai/chat/session";
import { createMessageId } from "@/lib/ai/format";
import type { AiChatMessage } from "@/lib/ai/types";

function createWelcomeMessage(config: AiAgentConfig): AiChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: config.welcomeMessage,
    createdAt: new Date().toISOString(),
    status: "sent",
  };
}

function isBookingIntent(text: string) {
  return /(termin|buchen|buchung|reservier|appointment|uhrzeit.*frei)/i.test(text);
}

type UseAiChatOptions = {
  agent: AiAgentConfig;
  onOpenBooking?: () => void;
};

export function useAiChat({ agent, onOpenBooking }: UseAiChatOptions) {
  const welcomeMessage = useMemo(() => createWelcomeMessage(agent), [agent]);

  const [messages, setMessages] = useState<AiChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadChatSession();
    if (stored?.length) {
      setMessages(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveChatSession(messages);
  }, [hydrated, messages]);

  const appendAssistantMessage = useCallback((content: string, structured?: AiChatMessage["structured"]) => {
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "assistant",
        content,
        structured,
        createdAt: new Date().toISOString(),
        status: "sent",
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (rawValue: string) => {
      const content = rawValue.trim();
      if (!content || isTyping) {
        return;
      }

      if (isBookingIntent(content)) {
        onOpenBooking?.();
      }

      const userMessage: AiChatMessage = {
        id: createMessageId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      const assistantId = createMessageId();
      const assistantShell: AiChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        status: "streaming",
      };

      const nextMessages = [...messages, userMessage];
      setError(null);
      setMessages([...nextMessages, assistantShell]);
      setInput("");
      setIsTyping(true);

      try {
        const { structured } = await sendChatToApi({ messages: nextMessages });

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: structured.text,
                  structured,
                  status: "sent",
                }
              : message,
          ),
        );
      } catch (sendError) {
        const errorText =
          sendError instanceof Error
            ? sendError.message
            : "Nachricht konnte nicht gesendet werden.";

        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: errorText,
                  status: "error",
                  retryPayload: content,
                }
              : message,
          ),
        );
        setError(errorText);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages, onOpenBooking],
  );

  const retryMessage = useCallback(
    async (messageId: string) => {
      const failed = messages.find((message) => message.id === messageId);
      if (!failed?.retryPayload) {
        return;
      }

      setMessages((current) => current.filter((message) => message.id !== messageId));
      await sendMessage(failed.retryPayload);
    },
    [messages, sendMessage],
  );

  const clearChat = useCallback(() => {
    clearChatSession();
    setMessages([welcomeMessage]);
    setError(null);
    setInput("");
  }, [welcomeMessage]);

  const lastMessage = messages.at(-1);
  const showTypingIndicator =
    isTyping && lastMessage?.role === "assistant" && lastMessage.status === "streaming";

  return {
    messages,
    input,
    isTyping,
    error,
    hydrated,
    showTypingIndicator,
    setInput,
    setError,
    sendMessage,
    retryMessage,
    clearChat,
    appendAssistantMessage,
  };
}
