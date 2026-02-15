"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProductNavLinks() {
  const pathname = usePathname();

  // Hide nav links on individual lesson pages
  const isLessonPage = /^\/lessons\/[^/]+$/.test(pathname);
  if (isLessonPage) return null;

  return (
    <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
      <Link
        className="transition-colors hover:text-foreground"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className="transition-colors hover:text-foreground"
        href="/lessons/new"
      >
        Generate
      </Link>
    </nav>
  );
}
