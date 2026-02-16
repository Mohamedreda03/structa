"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createLessonAction(formData: FormData) {
  const topic = formData.get("topic") as string;
  const difficulty = formData.get("difficulty") as string;
  const language = (formData.get("language") as string) || "English";

  if (!topic || !difficulty) {
    return { error: "Topic and difficulty are required" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [newLesson] = await db
    .insert(lessons)
    .values({
      userId: session.user.id,
      title: topic,
      topic: topic,
      difficulty: difficulty,
      language: language,
      status: "generating",
    })
    .returning();

  if (!newLesson) {
    return { error: "Failed to create lesson" };
  }

  redirect(`/lessons/${newLesson.id}`);
}
