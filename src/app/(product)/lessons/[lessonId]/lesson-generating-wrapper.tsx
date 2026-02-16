"use client";

import dynamic from "next/dynamic";

const LessonGenerating = dynamic(() => import("./lesson-generating"), {
  ssr: false,
});

interface LessonGeneratingWrapperProps {
  lessonId: string;
  topic: string;
  difficulty: string;
  language: string;
  failed?: boolean;
}

export default function LessonGeneratingWrapper(
  props: LessonGeneratingWrapperProps,
) {
  return <LessonGenerating {...props} />;
}
