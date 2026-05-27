"use client";

import { useEffect, useState } from "react";

import { aiAdminSections, type AiAdminSectionId } from "@/lib/admin/ai-sections";

type AiSectionNavProps = {
  activeId?: AiAdminSectionId;
};

export function AiSectionNav({ activeId = "general" }: AiSectionNavProps) {
  const [current, setCurrent] = useState<AiAdminSectionId>(activeId);

  useEffect(() => {
    const sectionElements = aiAdminSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setCurrent(visible.target.id as AiAdminSectionId);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="KI-Assistent Bereiche"
      className="sticky top-0 z-10 -mx-1 overflow-x-auto rounded-2xl border border-border bg-background/95 p-1 backdrop-blur-md"
    >
      <ul className="flex min-w-max gap-1 px-1 py-1">
        {aiAdminSections.map((section) => {
          const isActive = current === section.id;

          return (
            <li key={section.id}>
              <a
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gold/10 text-gold-soft"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
                href={`#${section.id}`}
                onClick={() => setCurrent(section.id)}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
