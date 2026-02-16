"use client";

interface GeneratingHeaderProps {
  title: string;
}

export function GeneratingHeader({ title }: GeneratingHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 uppercase tracking-widest font-medium">
        <span>Creating</span>
        <span className="text-muted-foreground/30">/</span>
        <span>Lesson</span>
      </div>
      <h1
        className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
        dir="auto"
      >
        {title}
      </h1>
    </div>
  );
}
