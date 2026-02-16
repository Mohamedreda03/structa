"use client";

interface GeneratingStatusProps {
  label: string;
  description: string;
}

export function GeneratingStatus({
  label,
  description,
}: GeneratingStatusProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/40 border border-border/50">
      <div className="relative shrink-0">
        <div className="w-2.5 h-2.5 bg-primary rounded-full" />
        <div className="absolute inset-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-40" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
