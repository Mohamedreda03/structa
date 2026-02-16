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

  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Session error:", error);
    return { error: "Connection error. Please try again." };
  }

  if (!session) {
    return { error: "Unauthorized" };
  }

  let newLesson;
  try {
    const [result] = await db
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
    newLesson = result;
  } catch (error) {
    console.error("DB insert error:", error);
    return { error: "Failed to create lesson. Please try again." };
  }

  if (!newLesson) {
    return { error: "Failed to create lesson" };
  }

  redirect(`/lessons/${newLesson.id}`);
}
