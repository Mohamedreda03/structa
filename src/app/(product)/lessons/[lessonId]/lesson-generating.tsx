"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { GeneratingHeader } from "@/components/lessons/generating-header";
import { GeneratingStatus } from "@/components/lessons/generating-status";
import { GeneratingSectionList } from "@/components/lessons/generating-section-list";

const lessonSchema = z.object({
  title: z.string().describe("The title of the lesson"),
  sections: z
    .array(
      z.object({
        title: z.string().describe("The title of the section"),
        content: z
          .string()
          .describe(
            "The detailed content of the section, formatted in Markdown",
          ),
      }),
    )
    .describe("The sections of the lesson"),
});

interface LessonGeneratingProps {
  lessonId: string;
  topic: string;
  difficulty: string;
  language: string;
  failed?: boolean;
}

export default function LessonGenerating({
  lessonId,
  topic,
  difficulty,
  language,
  failed = false,
}: LessonGeneratingProps) {
  const [phase, setPhase] = useState<"idle" | "streaming" | "failed">(
    failed ? "failed" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const hasStarted = useRef(false);
  const wasLoading = useRef(false);

  const { object, submit, isLoading, error } = useObject({
    api: "/api/generate-lesson",
    schema: lessonSchema,
  });

  useEffect(() => {
    if (isLoading) {
      wasLoading.current = true;
    }

    if (!isLoading && wasLoading.current && phase === "streaming") {
      wasLoading.current = false;

      if (error) {
        setPhase("failed");
        setErrorMessage("Failed to generate lesson content.");
        return;
      }

      setTimeout(() => {
        router.refresh();
      }, 2500);
    }
  }, [isLoading, error, phase, router]);

  useEffect(() => {
    if (error && phase === "streaming") {
      setPhase("failed");
      setErrorMessage(error.message || "Failed to generate lesson content.");
    }
  }, [error, phase]);

  const startGeneration = useCallback(() => {
    setPhase("streaming");
    setErrorMessage("");
    wasLoading.current = false;
    submit({ lessonId, topic, difficulty, language });
  }, [lessonId, topic, difficulty, language, submit]);

  useEffect(() => {
    if (!failed && !hasStarted.current) {
      hasStarted.current = true;
      startGeneration();
    }
  }, [failed, startGeneration]);

  // Derive status
  const hasTitle = !!object?.title;
  const sections = (object?.sections as any[]) ?? [];
  const hasSections = sections.length > 0;

  let statusLabel = "Thinking";
  let statusDescription = "AI is analyzing your topic";

  if (!hasTitle && !hasSections) {
    statusLabel = "Thinking";
    statusDescription = "AI is analyzing your topic";
  } else if (hasTitle && !hasSections) {
    statusLabel = "Structuring";
    statusDescription = "Organizing the lesson layout";
  } else if (hasSections) {
    const allDone = sections.every(
      (s: any) => s?.content && s.content.length > 50,
    );
    if (allDone && !isLoading) {
      statusLabel = "Finalizing";
      statusDescription = "Saving your lesson";
    } else {
      statusLabel = "Generating content";
      statusDescription = "Writing lesson sections";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="max-w-lg w-full">
        {phase !== "failed" ? (
          <div className="space-y-6">
            <GeneratingHeader title={object?.title || topic} />

            <GeneratingStatus
              label={statusLabel}
              description={statusDescription}
            />

            <GeneratingSectionList sections={sections} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <div className="mx-auto w-10 h-10 rounded-md bg-destructive/10 flex items-center justify-center mb-4">
                <span className="text-destructive text-lg">✕</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Generation failed
              </h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
            <Button
              onClick={() => {
                hasStarted.current = false;
                startGeneration();
              }}
              variant="outline"
              className="gap-2 border-border hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
