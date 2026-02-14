"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { lessonSections, aiEdits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function applyAiEditAction({
  sectionId,
  selectedText,
  instruction,
}: {
  sectionId: string;
  selectedText: string;
  instruction: string;
}) {
  const section = await db.query.lessonSections.findFirst({
    where: eq(lessonSections.id, sectionId),
    with: {
      lesson: true,
    },
  });

  if (!section) {
    throw new Error("Section not found");
  }

  const language = section.lesson.language;

  const { text: newContent } = await generateText({
    model: google("gemini-2.5-flash"),
    system: `You are an expert technical editor working in ${language}. 
    You will be given a section of a lesson, a specific part of that text that the user has selected, and an instruction on how to modify that selection or the section as a whole.
    Provide the ENTIRE updated content for the section in Markdown. 
    Maintain the existing tone and structure while incorporating the requested changes.
    
    ${language === "Arabic" ? "CRITICAL: Maintain the Arabic language for all prose. Keep all code blocks and technical identifiers in English (LTR)." : ""}

    CRITICAL MARKDOWN RULES:
    1. NEVER output empty code blocks.
    2. ALWAYS specify a language for code blocks.
    3. Return ONLY the Markdown content for the section, no extra commentary.
    4. Ensure all code blocks are correctly closed with triple backticks.`,
    prompt: `
    Current Section Content:
    ${section.content}

    User Selected Text:
    "${selectedText}"

    Instruction:
    "${instruction}"
    
    Return only the updated content for the entire section.`,
  });

  await db.transaction(async (tx) => {
    await tx
      .update(lessonSections)
      .set({ content: newContent })
      .where(eq(lessonSections.id, sectionId));

    await tx.insert(aiEdits).values({
      sectionId: sectionId,
      selectedText: selectedText,
      generatedText: newContent,
      action: instruction,
    });
  });

  revalidatePath(`/lessons/${section.lessonId}`);
  
  return { success: true };
}
