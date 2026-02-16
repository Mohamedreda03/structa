"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateLessonContentAction } from "@/app/actions/generate-lesson-content";
import { checkLessonStatusAction } from "@/app/actions/check-lesson-status";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [status, setStatus] = useState<"generating" | "failed">(
    failed ? "failed" : "generating",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const hasStarted = useRef(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();

    pollingRef.current = setInterval(async () => {
      try {
        const result = await checkLessonStatusAction(lessonId);

        if (result.status === "draft") {
          stopPolling();
          router.refresh();
        } else if (result.status === "failed") {
          stopPolling();
          setStatus("failed");
          setErrorMessage("Generation failed. Please try again.");
        }
      } catch {
        // Polling error — ignore and retry on next interval
      }
    }, 3000);
  }, [lessonId, router, stopPolling]);

  const startGeneration = useCallback(() => {
    setStatus("generating");
    setErrorMessage("");

    // Fire and forget — don't await the result
    // The server action will complete even if the HTTP response times out
    generateLessonContentAction(lessonId, topic, difficulty, language).catch(
      () => {
        // Ignore timeout errors — the generation may still complete server-side
      },
    );

    // Start polling to check when generation is done
    startPolling();
  }, [lessonId, topic, difficulty, language, startPolling]);

  useEffect(() => {
    if (!failed && !hasStarted.current) {
      hasStarted.current = true;
      startGeneration();
    }

    return () => stopPolling();
  }, [failed, startGeneration, stopPolling]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "generating" ? (
          <>
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Generating your lesson...
              </h2>
              <p className="text-sm text-muted-foreground">
                AI is creating content about{" "}
                <span className="font-medium text-foreground">
                  &ldquo;{topic}&rdquo;
                </span>
              </p>
              <p className="text-xs text-muted-foreground/70">
                This usually takes 15-30 seconds
              </p>
            </div>

            <div className="flex justify-center gap-1.5 pt-2">
              <div
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Generation Failed
              </h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
            <Button onClick={startGeneration} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
