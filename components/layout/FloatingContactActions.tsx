"use client";

import { useState } from "react";

type FloatingContactActionsProps = {
  phone: string;
  whatsappUrl: string;
};

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M6.6 4.8 8.7 4c.7-.3 1.5 0 1.8.7l1 2.4c.2.6.1 1.2-.4 1.6l-1.2 1c.8 1.7 2.1 3.1 3.8 3.9l1.1-1.2c.4-.5 1.1-.6 1.6-.3l2.4 1.1c.7.3 1 1.1.7 1.8l-.9 2.1c-.3.7-.9 1.1-1.7 1.1C10.4 18.1 5 12.7 5 6.2c0-.7.6-1.2 1.6-1.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M5.4 18.7 6.3 16A7.4 7.4 0 1 1 12 18.9a7.5 7.5 0 0 1-3.5-.9l-3.1.7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.4 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .5l-.4.6c-.1.1-.2.3-.1.5.3.7 1.3 1.7 2.1 2 .2.1.4 0 .5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.2.4.3.4.5 0 .8-.7 1.6-1.5 1.7-1.3.2-3.1-.7-4.7-2.2-1.6-1.5-2.6-3.2-2.5-4.5 0-.3.2-.5.4-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M5 10.5a7 7 0 0 1 14 0c0 4.5-4 7.5-7 9.5-3-2-7-5-7-9.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.8 10.8h4.4M9.8 13.4h2.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function FloatingContactActions({ phone, whatsappUrl }: FloatingContactActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3 md:hidden">
      {open ? (
        <div className="flex flex-col items-end gap-3">
          <a
            aria-label="Direkt anrufen"
            className="touch-press flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-surface text-gold shadow-luxury transition active:scale-95"
            href={`tel:${phone}`}
          >
            <PhoneIcon />
          </a>
          <a
            aria-label="WhatsApp öffnen"
            className="touch-press flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500 text-black shadow-luxury transition active:scale-95"
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppIcon />
          </a>
        </div>
      ) : null}

      <button
        aria-expanded={open}
        aria-label={open ? "Kontaktoptionen schließen" : "Kontaktoptionen öffnen"}
        className="touch-press flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-gold text-black shadow-luxury transition active:scale-95"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <ContactIcon />
      </button>
    </div>
  );
}
