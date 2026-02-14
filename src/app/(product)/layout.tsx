import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-8">
            <Link className="flex items-center space-x-2 font-bold tracking-tight" href="/dashboard">
              <span className="inline-block h-6 w-6 bg-primary rounded-sm mr-2" />
              LESSONOS
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link className="transition-colors hover:text-foreground" href="/dashboard">
                Dashboard
              </Link>
              <Link className="transition-colors hover:text-foreground" href="/lessons/new">
                Generate
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav user={session.user} />
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-screen-2xl px-4 md:px-8 py-6">{children}</main>
    </div>
  );
}
