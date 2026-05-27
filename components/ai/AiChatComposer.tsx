"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

type AiChatComposerProps = {
  disabled?: boolean;
  error?: string | null;
  isLoading?: boolean;
  onDismissError?: () => void;
  onSend: (value: string) => void;
  onChange: (value: string) => void;
  value: string;
};

const MAX_TEXTAREA_ROWS = 5;
const LINE_HEIGHT_PX = 24;

export function AiChatComposer({
  disabled = false,
  error = null,
  isLoading = false,
  onDismissError,
  onChange,
  onSend,
  value,
}: AiChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isBlocked = disabled || isLoading;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    const maxHeight = LINE_HEIGHT_PX * MAX_TEXTAREA_ROWS + 20;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
  }, [value]);

  function submitMessage() {
    if (isBlocked || !value.trim()) {
      return;
    }

    onSend(value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    submitMessage();
  }

  function handleFocus() {
    requestAnimationFrame(() => {
      textareaRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  }

  return (
    <div className="ai-chat-composer shrink-0 border-t border-border bg-background/90 backdrop-blur-md">
      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-3 flex items-start justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 sm:mx-6"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: -6 }}
            role="alert"
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs leading-5 text-red-200">{error}</p>
            {onDismissError ? (
              <button
                aria-label="Fehler schließen"
                className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-200 transition hover:text-red-100"
                onClick={onDismissError}
                type="button"
              >
                OK
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <form className="px-4 py-3 sm:px-6" onSubmit={handleSubmit}>
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="ai-chat-input">
            Nachricht an den Assistenten
          </label>
          <textarea
            autoCapitalize="sentences"
            autoCorrect="on"
            className="min-h-11 flex-1 resize-none rounded-2xl border border-border bg-background px-4 py-2.5 text-base leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-[var(--ai-accent)] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            disabled={isBlocked}
            enterKeyHint="send"
            id="ai-chat-input"
            inputMode="text"
            onChange={(event) => onChange(event.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Assistent antwortet…" : "Nachricht…"}
            ref={textareaRef}
            rows={1}
            value={value}
          />
          <button
            aria-busy={isLoading}
            aria-label={isLoading ? "Nachricht wird gesendet" : "Nachricht senden"}
            className="touch-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ai-accent)] bg-[var(--ai-accent)] text-black transition hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isBlocked || !value.trim()}
            type="submit"
          >
            {isLoading ? (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"
              />
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 19V5m0 0-7 7 7-7m0 0 7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
