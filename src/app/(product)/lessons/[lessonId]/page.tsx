import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, lessonSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import LessonEditorWrapper from "./lesson-editor-wrapper";
import LessonGeneratingWrapper from "./lesson-generating-wrapper";

interface PageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lessonId)) {
    notFound();
  }

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });

  if (!lesson) {
    notFound();
  }

  // If the lesson is still generating, show the generating UI
  if (lesson.status === "generating") {
    return (
      <LessonGeneratingWrapper
        lessonId={lesson.id}
        topic={lesson.topic}
        difficulty={lesson.difficulty}
        language={lesson.language}
      />
    );
  }

  // If generation failed, show error with retry
  if (lesson.status === "failed") {
    return (
      <LessonGeneratingWrapper
        lessonId={lesson.id}
        topic={lesson.topic}
        difficulty={lesson.difficulty}
        language={lesson.language}
        failed
      />
    );
  }

  const sections = await db.query.lessonSections.findMany({
    where: eq(lessonSections.lessonId, lessonId),
    orderBy: [asc(lessonSections.order)],
  });

  const formattedLesson = {
    id: lesson.id,
    title: lesson.title,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
    })),
  };

  return <LessonEditorWrapper lesson={formattedLesson} />;
}
