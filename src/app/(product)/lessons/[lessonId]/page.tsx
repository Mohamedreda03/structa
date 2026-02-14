import { notFound } from "next/navigation";
import { db } from "@/db";
import { lessons, lessonSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import LessonEditorWrapper from "./lesson-editor-wrapper";

interface PageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lessonId } = await params;

  // Validate UUID to prevent database error on non-UUID strings like "lesson-1"
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(lessonId)) {
    notFound();
  }

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  });

  if (!lesson) {
    notFound();
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
