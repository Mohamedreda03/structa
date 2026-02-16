"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GripVertical } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

interface EditorSectionProps {
  id: string;
  title: string;
  content: string;
  onSelection: (id: string, e: React.MouseEvent | React.KeyboardEvent) => void;
  sectionRef: (el: HTMLElement | null) => void;
}

export function EditorSection({
  id,
  title,
  content,
  onSelection,
  sectionRef,
}: EditorSectionProps) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className="group/section relative"
      onMouseUp={(e) => onSelection(id, e)}
      onKeyUp={(e) => onSelection(id, e)}
    >
      <div className="absolute -left-12 top-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity p-1 rounded hover:bg-muted cursor-grab text-muted-foreground hidden xl:block">
        <GripVertical className="h-4 w-4" />
      </div>

      <h2
        className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2 tracking-tight"
        dir="auto"
      >
        {title}
      </h2>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed"
        dir="auto"
        suppressHydrationWarning
        spellCheck="false"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ children }) => <>{children}</>,
            p: ({ children }) => (
              <p className="mb-4 leading-7 last:mb-0">{children}</p>
            ),
            code: ({
              className,
              children,
              ...props
            }: {
              className?: string;
              children?: React.ReactNode;
            }) => {
              const match = /language-(\w+)/.exec(className || "");
              const contentStr = String(children || "").replace(/\n$/, "");
              const isBlock = match || contentStr.includes("\n");

              if (isBlock) {
                return (
                  <CodeBlock language={match?.[1] || "code"}>
                    {contentStr}
                  </CodeBlock>
                );
              }

              return (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono text-destructive"
                  {...props}
                >
                  {contentStr}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
