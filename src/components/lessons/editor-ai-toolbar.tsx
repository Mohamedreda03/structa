"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, SendHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AiToolbarProps {
  position: { top: number; left: number } | null;
  showInput: boolean;
  onShowInput: () => void;
  onClose: () => void;
  onSubmit: () => void;
  instruction: string;
  onInstructionChange: (val: string) => void;
  isWorking: boolean;
}

export function AiToolbar({
  position,
  showInput,
  onShowInput,
  onClose,
  onSubmit,
  instruction,
  onInstructionChange,
  isWorking,
}: AiToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node) &&
        !window.getSelection()?.toString().trim()
      ) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose]);

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 -translate-x-1/2 flex flex-col items-center animate-in fade-in zoom-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      {!showInput ? (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onShowInput();
          }}
          className="bg-foreground text-background hover:bg-foreground/90 shadow-xl rounded-md px-3 h-8 gap-2 border border-border/10"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Edit with AI</span>
        </Button>
      ) : (
        <div className="bg-popover border border-border rounded-lg p-1.5 shadow-xl flex items-center gap-1 min-w-[240px] sm:min-w-[320px] animate-in slide-in-from-bottom-2">
          <Input
            autoFocus
            placeholder={isWorking ? "AI is working..." : "Ask AI to edit..."}
            className="bg-transparent border-none focus-visible:ring-0 text-popover-foreground h-8 text-sm placeholder:text-muted-foreground px-2"
            value={instruction}
            onChange={(e) => onInstructionChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            disabled={isWorking}
            dir="auto"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-primary hover:bg-muted"
            onClick={onSubmit}
            disabled={isWorking || !instruction.trim()}
          >
            <SendHorizontal
              className={cn("h-3.5 w-3.5", isWorking && "animate-pulse")}
            />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={onClose}
            disabled={isWorking}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
