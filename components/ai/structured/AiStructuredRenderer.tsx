"use client";

import { AiDataTable } from "@/components/ai/structured/AiDataTable";
import type { AiStructuredBlock } from "@/lib/ai/structured/types";

type AiStructuredRendererProps = {
  blocks?: AiStructuredBlock[];
  onBook?: () => void;
};

export function AiStructuredRenderer({ blocks, onBook }: AiStructuredRendererProps) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "table") {
          return (
            <AiDataTable
              columns={block.columns}
              key={`table-${index}`}
              rows={block.rows}
              title={block.title}
            />
          );
        }

        if (block.type === "key_value") {
          return (
            <div
              className="rounded-2xl border border-border bg-background p-4"
              key={`kv-${index}`}
            >
              {block.title ? (
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                  {block.title}
                </p>
              ) : null}
              <dl className="space-y-2.5">
                {block.items.map((item) => (
                  <div className="flex items-start justify-between gap-4 text-sm" key={item.label}>
                    <dt className="text-muted">{item.label}</dt>
                    <dd className="text-right font-medium text-foreground">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        }

        if (block.type === "list") {
          return (
            <div
              className="rounded-2xl border border-border bg-background p-4"
              key={`list-${index}`}
            >
              {block.title ? (
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
                  {block.title}
                </p>
              ) : null}
              <ul className="space-y-1.5 text-sm leading-6 text-foreground">
                {block.items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span aria-hidden="true" className="text-gold">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (block.type === "cta") {
          const isBook = block.action === "book";

          return (
            <button
              className="touch-press w-full rounded-full border border-[var(--ai-accent)] bg-[var(--ai-accent)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:opacity-90"
              key={`cta-${index}`}
              onClick={() => {
                if (isBook) {
                  onBook?.();
                }
              }}
              type="button"
            >
              {block.label}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}
