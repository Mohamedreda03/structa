"use server";

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { lessons, lessonSections } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function generateLessonAction(formData: FormData) {
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

  let lessonId: string | null = null;

  try {
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You are a professional instructor across all fields. 
          Provide clear, detailed, and systematic technical explanations in ${language}. 
          Prioritize numerous real-life examples and practical analogies to ground theoretical concepts. 
          Be concise, accurate, and professional. Use structured Markdown for all content.
          
          ${language === "Arabic" ? "CRITICAL: Write all prose and explanations in Arabic. However, keep all technical code blocks, commands, and variable names in English (LTR)." : ""}

          CRITICAL MARKDOWN RULES:
          1. NEVER output empty code blocks.
          2. ALWAYS specify a language for code blocks (e.g., \`\`\`bash, \`\`\`typescript).
          3. Ensure code blocks contain actual code or commands.
          4. Use proper heading levels (##, ###) for structure.
          5. Ensure all Markdown is valid and well-formatted.`,
      output: Output.object({
        schema: lessonSchema,
      }),
      prompt: `Create a comprehensive, structured lesson in ${language} about "${topic}" for a ${difficulty} level audience. 
      The lesson should have a clear logical progression and consist of 4 to 6 sections.
      Each section must be detailed, including practical code examples or analogies where applicable.`,
    });

    if (!output) {
      return { error: "AI failed to generate lesson content" };
    }

    const { title, sections } = output;

    const [newLesson] = await db
      .insert(lessons)
      .values({
        userId: session.user.id,
        title: title,
        topic: topic,
        difficulty: difficulty,
        language: language,
        status: "draft",
      })
      .returning();

    if (!newLesson) {
      return { error: "Failed to create lesson in database" };
    }

    if (sections && sections.length > 0) {
      await db.insert(lessonSections).values(
        sections.map((section, index) => ({
          lessonId: newLesson.id,
          title: section.title,
          content: section.content,
          order: index,
        })),
      );
    }

    lessonId = newLesson.id;
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error in generateLessonAction:", error);
    return { error: "Failed to generate lesson. Please try again." };
  }

  // redirect() must be called OUTSIDE try/catch because it throws internally
  redirect(`/lessons/${lessonId}`);
}
