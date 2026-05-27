"use client";

type AiChatQuickActionsProps = {
  disabled?: boolean;
  onBook: () => void;
  onPrompt: (text: string) => void;
};

const actions = [
  { id: "book", label: "Termin buchen", type: "book" as const },
  { id: "prices", label: "Preise", prompt: "Welche Preise habt ihr?" },
  { id: "hours", label: "Öffnungszeiten", prompt: "Wann habt ihr geöffnet?" },
  { id: "services", label: "Leistungen", prompt: "Welche Leistungen bietet ihr an?" },
];

export function AiChatQuickActions({ disabled = false, onBook, onPrompt }: AiChatQuickActionsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {actions.map((action) => (
        <button
          className="touch-press shrink-0 rounded-full border border-border bg-background px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          key={action.id}
          onClick={() => {
            if (action.type === "book") {
              onBook();
              return;
            }
            if (action.prompt) {
              onPrompt(action.prompt);
            }
          }}
          type="button"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
