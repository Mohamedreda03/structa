import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { lessons, lessonSections } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topic, difficulty, language = "English" } = body;

  if (!topic || !difficulty) {
    return NextResponse.json(
      { error: "Topic and difficulty are required" },
      { status: 400 },
    );
  }

  // Use a ReadableStream to keep the connection alive during AI generation
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        // Send a keep-alive message immediately
        controller.enqueue(encoder.encode('{"status":"generating"}\n'));

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
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error: "AI failed to generate lesson content",
              }) + "\n",
            ),
          );
          controller.close();
          return;
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
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ error: "Failed to create lesson in database" }) +
                "\n",
            ),
          );
          controller.close();
          return;
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

        revalidatePath("/dashboard");

        // Send the final success response
        controller.enqueue(
          encoder.encode(JSON.stringify({ lessonId: newLesson.id }) + "\n"),
        );
        controller.close();
      } catch (error) {
        console.error("Error in generate-lesson API:", error);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ error: "Failed to generate lesson" }) + "\n",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
