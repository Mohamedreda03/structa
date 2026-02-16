"use client";

import { cn } from "@/lib/utils";

interface EditorSidebarProps {
  sections: {
    id: string;
    title: string;
  }[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

export function EditorSidebar({
  sections,
  activeSectionId,
  onSectionClick,
}: EditorSidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden xl:block sticky top-24 h-fit overflow-y-auto bg-transparent">
      <div className="space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </p>
        <nav className="relative border-l border-border pl-0">
          {/* Sliding Indicator */}
          <div
            className="absolute -left-px w-[2px] bg-primary transition-all duration-300 ease-in-out"
            style={{
              height: "28px",
              top: `${sections.findIndex((s) => s.id === activeSectionId) * 28}px`,
              opacity: activeSectionId ? 1 : 0,
            }}
          />

          <div className="flex flex-col">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  "block w-full text-left text-sm py-1 pl-4 transition-colors duration-300 h-[28px] line-clamp-1",
                  activeSectionId === section.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
