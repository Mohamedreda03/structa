"use client";

import { useEffect, useRef, useState } from "react";
import { applyAiEditAction } from "@/app/actions/ai-edit";
import { toast } from "sonner";
import { EditorSidebar } from "@/components/lessons/editor-sidebar";
import { EditorSection } from "@/components/lessons/editor-section";
import { AiToolbar } from "@/components/lessons/editor-ai-toolbar";

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
        if (lastSection) setActiveSectionId(lastSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
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
        </div>

        <div
          ref={containerRef}
          className="space-y-10 sm:space-y-16 pb-16 sm:pb-32 relative"
          spellCheck="false"
          data-ms-editor="false"
        >
          <AiToolbar
            position={toolbarPosition}
            showInput={showInput}
            onShowInput={() => setShowInput(true)}
            onClose={handleCloseToolbar}
            onSubmit={handleAiSubmit}
            instruction={aiInstruction}
            onInstructionChange={setAiInstruction}
            isWorking={isAiWorking}
          />

          {lesson.sections.map((section) => (
            <EditorSection
              key={section.id}
              id={section.id}
              title={section.title}
              content={section.content}
              onSelection={handleSelection}
              sectionRef={(el) => {
                sectionRefs.current[section.id] = el;
              }}
            />
          ))}

          <div className="pt-12 border-t border-border mt-12">
            <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors text-sm font-medium">
              <span className="text-lg">+</span> Add a new section
            </button>
          </div>
        </div>
      </div>

      <EditorSidebar
        sections={lesson.sections}
        activeSectionId={activeSectionId}
        onSectionClick={scrollToSection}
      />
    </div>
  );
}
