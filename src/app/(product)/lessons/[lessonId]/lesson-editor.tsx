"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, X, SendHorizontal, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { applyAiEditAction } from "@/app/actions/ai-edit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { toast } from "sonner";

interface LessonEditorProps {
  lesson: {
    id: string;
    title: string;
    sections: {
      id: string;
      title: string;
      content: string;
    }[];
  };
}

export default function LessonEditor({ lesson }: LessonEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    lesson.sections[0]?.id || "",
  );
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [aiInstruction, setAiInstruction] = useState("");
  const [isAiWorking, setIsAiWorking] = useState(false);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isManualScrolling = useRef(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 50;

      if (scrollPosition >= threshold && !isManualScrolling.current) {
        const lastSection = lesson.sections[lesson.sections.length - 1];
        setActiveSectionId(lastSection.id);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node) &&
        !window.getSelection()?.toString().trim()
      ) {
        handleCloseToolbar();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [lesson.sections]);

  const scrollToSection = (id: string) => {
    isManualScrolling.current = true;
    setActiveSectionId(id);

    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  };

  const handleSelection = (
    sectionId: string,
    e?: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (e && toolbarRef.current?.contains(e.target as Node)) {
      return;
    }

    setTimeout(() => {
      if (showInput) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !containerRef.current) {
        setToolbarPosition(null);
        setSelectedText("");
        setSelectedSectionId("");
        return;
      }

      const text = selection.toString().trim();
      if (text && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setSelectedText(text);
        setSelectedSectionId(sectionId);
        setToolbarPosition({
          top: rect.top - containerRect.top - 50,
          left: rect.left - containerRect.left + rect.width / 2,
        });
      }
    }, 10);
  };

  const handleCloseToolbar = () => {
    setSelectedText("");
    setSelectedSectionId("");
    setToolbarPosition(null);
    setShowInput(false);
    setAiInstruction("");
    window.getSelection()?.removeAllRanges();
  };

  const handleAiSubmit = async () => {
    if (!aiInstruction.trim() || !selectedSectionId || isAiWorking) return;

    setIsAiWorking(true);
    try {
      await applyAiEditAction({
        sectionId: selectedSectionId,
        selectedText,
        instruction: aiInstruction,
      });
      handleCloseToolbar();
      toast.success("Section updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply AI edit.");
    } finally {
      setIsAiWorking(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] flex flex-col xl:flex-row gap-8 sm:gap-16 py-6 sm:py-12 px-4 sm:px-0">
      <div className="flex-1 min-w-0">
        <div className="mb-8 sm:mb-16 group">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
            <span>Lesson</span>
            <span className="text-muted-foreground/40">/</span>
            <span>{lesson.title}</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight leading-tight"
            dir="auto"
          >
            {lesson.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive guide generated with AI.
          </p>
        </div>

        <div
          ref={containerRef}
          className="space-y-10 sm:space-y-16 pb-16 sm:pb-32 relative"
          spellCheck="false"
          data-ms-editor="false"
        >
          {toolbarPosition && (
            <div
              ref={toolbarRef}
              className="absolute z-50 -translate-x-1/2 flex flex-col items-center animate-in fade-in zoom-in duration-200"
              style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
            >
              {!showInput ? (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInput(true);
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
                    placeholder={
                      isAiWorking ? "AI is working..." : "Ask AI to edit..."
                    }
                    className="bg-transparent border-none focus-visible:ring-0 text-popover-foreground h-8 text-sm placeholder:text-muted-foreground px-2"
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                    disabled={isAiWorking}
                    dir="auto"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-primary hover:bg-muted"
                    onClick={handleAiSubmit}
                    disabled={isAiWorking || !aiInstruction.trim()}
                  >
                    <SendHorizontal
                      className={cn(
                        "h-3.5 w-3.5",
                        isAiWorking && "animate-pulse",
                      )}
                    />
                  </Button>
                  <div className="w-[1px] h-4 bg-border mx-1" />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={handleCloseToolbar}
                    disabled={isAiWorking}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {lesson.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
              className="group/section relative"
              onMouseUp={(e) => handleSelection(section.id, e)}
              onKeyUp={(e) => handleSelection(section.id, e)}
            >
              <div className="absolute -left-12 top-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity p-1 rounded hover:bg-muted cursor-grab text-muted-foreground hidden xl:block">
                <GripVertical className="h-4 w-4" />
              </div>

              <h2
                className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2 tracking-tight"
                dir="auto"
              >
                {section.title}
              </h2>

              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed"
                dir="auto"
                suppressHydrationWarning
                spellCheck="false"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children }) => <>{children}</>,
                    p: ({ children }) => (
                      <p className="mb-4 leading-7 last:mb-0">{children}</p>
                    ),
                    code: ({
                      className,
                      children,
                      ...props
                    }: {
                      className?: string;
                      children?: React.ReactNode;
                    }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const content = String(children || "").replace(/\n$/, "");
                      const isBlock = match || content.includes("\n");

                      if (isBlock) {
                        return (
                          <CodeBlock language={match?.[1] || "code"}>
                            {content}
                          </CodeBlock>
                        );
                      }

                      return (
                        <code
                          className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono text-destructive"
                          {...props}
                        >
                          {content}
                        </code>
                      );
                    },
                  }}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </section>
          ))}

          <div className="pt-12 border-t border-border mt-12">
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors text-sm font-medium">
              <span className="text-lg">+</span> Add a new section
            </button>
          </div>
        </div>
      </div>

      <aside className="w-64 shrink-0 hidden xl:block sticky top-24 h-fit overflow-y-auto bg-transparent">
        <div className="space-y-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            On this page
          </p>
          <nav className="relative border-l border-border pl-0">
            {/* Sliding Indicator */}
            <div
              className="absolute left-[-1px] w-[2px] bg-primary transition-all duration-300 ease-in-out"
              style={{
                height: "28px",
                top: `${lesson.sections.findIndex((s) => s.id === activeSectionId) * 28}px`,
                opacity: activeSectionId ? 1 : 0,
              }}
            />

            <div className="flex flex-col">
              {lesson.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
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
    </div>
  );
}
