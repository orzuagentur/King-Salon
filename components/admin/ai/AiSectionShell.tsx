import type { ReactNode } from "react";

import type { AiAdminSection } from "@/lib/admin/ai-sections";

type AiSectionShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  section: AiAdminSection;
};

export function AiSectionShell({ section, children, footer }: AiSectionShellProps) {
  return (
    <section
      className="scroll-mt-28 rounded-[2rem] border border-border bg-surface p-6 shadow-luxury sm:p-8"
      id={section.id}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">KI-Assistent</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
        {section.title}
      </h2>
      <p className="mt-2 text-sm text-muted">{section.description}</p>
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 border-t border-border pt-6">{footer}</div> : null}
    </section>
  );
}
