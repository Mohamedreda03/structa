"use server";

import { db } from "@/db";
import { lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkLessonStatusAction(lessonId: string) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    columns: { status: true },
  });

  return { status: lesson?.status || "not_found" };
}
