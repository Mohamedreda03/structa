"use server";

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { db } from "@/db";
import { lessons, lessonSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

export async function generateLessonContentAction(
  lessonId: string,
  topic: string,
  difficulty: string,
  language: string,
) {
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
      await db
        .update(lessons)
        .set({ status: "failed" })
        .where(eq(lessons.id, lessonId));
      return { error: "AI failed to generate lesson content" };
    }

    const { title, sections } = output;

    // Update lesson title and status
    await db
      .update(lessons)
      .set({ title: title, status: "draft" })
      .where(eq(lessons.id, lessonId));

    // Insert sections
    if (sections && sections.length > 0) {
      await db.insert(lessonSections).values(
        sections.map((section, index) => ({
          lessonId: lessonId,
          title: section.title,
          content: section.content,
          order: index,
        })),
      );
    }

    revalidatePath("/dashboard");
    revalidatePath(`/lessons/${lessonId}`);

    return { success: true, title };
  } catch (error) {
    console.error("Error generating lesson content:", error);
    await db
      .update(lessons)
      .set({ status: "failed" })
      .where(eq(lessons.id, lessonId));
    return { error: "Failed to generate lesson content" };
  }
}
