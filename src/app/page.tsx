import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Wand2, MessageSquare, Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "LESSONOS - AI-Powered Technical Lesson Generator",
  description: "Create, refine, and master complex technical topics with AI-structured learning modules.",
};

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
          <Link className="flex items-center space-x-2 font-bold tracking-tight" href="/">
            <span className="inline-block h-6 w-6 bg-foreground rounded-sm mr-2" />
            LESSONOS
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link className="text-muted-foreground transition hover:text-foreground" href="#features">
              Features
            </Link>
            <Link className="text-muted-foreground transition hover:text-foreground" href="#how-it-works">
              How it Works
            </Link>
            <div className="h-4 w-px bg-border" />
            {session ? (
              <Link
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                href="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link className="text-muted-foreground transition hover:text-foreground" href="/sign-in">
                  Sign In
                </Link>
                <Link
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  href="/sign-up"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--secondary),transparent_70%)] opacity-50" />
          
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium tracking-tight text-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Now in Private Beta</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl leading-[1.1]">
            Build better technical <br />
            knowledge with <span className="text-muted-foreground">AI.</span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Stop scrolling through endless threads. LESSONOS uses advanced AI to generate structured, 
            interactive lessons tailored to your technical level.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              className="rounded-md bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
              href={session ? "/dashboard" : "/sign-up"}
            >
              {session ? "Go to Dashboard" : "Start Building for Free"}
            </Link>
            <Link
              className="rounded-md border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition hover:bg-muted"
              href="#how-it-works"
            >
              See how it works
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border">
          <div className="container mx-auto max-w-screen-xl px-6">
            <div className="mb-20 text-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Features</h2>
              <p className="mt-4 text-4xl font-bold tracking-tight">Everything you need to master a topic.</p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="group space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-border group-hover:border-primary transition-colors">
                  <Wand2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Structured Generation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Lessons are intelligently divided into logical sections like Intro, Core Concepts, and Hands-on Examples.
                </p>
              </div>
              <div className="group space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-border group-hover:border-primary transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI Editing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Select any section and use our AI toolbar to expand explanations, simplify concepts, or add more examples.
                </p>
              </div>
              <div className="group space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background border border-border group-hover:border-primary transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Instant Summaries</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get high-level takeaways and summaries for every lesson, perfect for quick review and retention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 text-center relative overflow-hidden">
          <div className="container mx-auto max-w-screen-md px-6 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Ready to level up?</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Join developers and engineers using LESSONOS to stay ahead of the curve. 
              Start generating your first lesson in seconds.
            </p>
            <div className="mt-10">
              <Link
                className="rounded-md bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
                href={session ? "/dashboard" : "/sign-up"}
              >
                {session ? "Go to Dashboard" : "Create My First Lesson"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-background">
        <div className="container mx-auto max-w-screen-2xl px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 LESSONOS. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  );
}
