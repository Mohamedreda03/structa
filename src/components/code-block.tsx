"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";
import { Button } from "./ui/button";

interface CodeBlockProps {
  children: string;
  language?: string;
}

// Module-level cache to prevent re-highlighting on remount (e.g. during scroll)
const highlightCache = new Map<string, string>();

export function CodeBlock({ children, language = "code" }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const displayLanguage = language || "code";
  const cacheKey = `${displayLanguage}:${children}`;

  const [highlightedHtml, setHighlightedHtml] = useState(
    () => highlightCache.get(cacheKey) || ""
  );

  useEffect(() => {
    // Already cached — set immediately and skip async work
    const cached = highlightCache.get(cacheKey);
    if (cached) {
      setHighlightedHtml(cached);
      return;
    }

    let cancelled = false;

    codeToHtml(children, {
      lang: displayLanguage.toLowerCase(),
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    })
      .then((html) => {
        highlightCache.set(cacheKey, html);
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {
        // Fallback for unsupported languages — render as plain text
        if (!cancelled) {
          codeToHtml(children, {
            lang: "text",
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
            defaultColor: false,
          }).then((html) => {
            highlightCache.set(cacheKey, html);
            if (!cancelled) setHighlightedHtml(html);
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [children, displayLanguage, cacheKey]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [children]);

  return (
    <div
      className="not-prose relative group my-6 rounded-md overflow-hidden border border-border bg-muted/30"
      dir="ltr"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/50 backdrop-blur-sm">
        <span className="text-[10px] font-medium font-mono text-muted-foreground uppercase tracking-widest">
          {displayLanguage}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-background/50"
          onClick={copyToClipboard}
        >
          {isCopied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="shiki-wrapper text-sm overflow-x-auto bg-[#fdfdfd] dark:bg-[#1e1e1e]">
        {highlightedHtml ? (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <pre className="p-6 font-mono text-[0.85rem] leading-[1.6] text-muted-foreground bg-transparent border-none">
            <code className="bg-transparent border-none p-0">{children}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
