"use client";

interface Section {
  title: string;
  content: string;
}

interface GeneratingSectionListProps {
  sections: Section[];
  isLoading: boolean;
}

export function GeneratingSectionList({
  sections,
  isLoading,
}: GeneratingSectionListProps) {
  if (sections.length === 0) return <div className="min-h-[120px]" />;

  return (
    <div className="min-h-[120px] space-y-0.5">
      {sections.map((section, i) => {
        const isComplete = section?.content && section.content.length > 50;
        const isActive = !isComplete && i === sections.length - 1 && isLoading;

        return (
          <div
            key={i}
            className={`px-3 py-2 rounded-md transition-all duration-300 ${
              isActive ? "bg-muted/40" : ""
            }`}
          >
            <span
              className={`text-sm transition-colors duration-300 ${
                isActive
                  ? "text-foreground font-medium"
                  : isComplete
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
              }`}
              dir="auto"
            >
              {section?.title || "..."}
            </span>
          </div>
        );
      })}
    </div>
  );
}
