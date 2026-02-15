import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Wand2,
  MessageSquare,
  Globe,
  GraduationCap,
  ArrowRight,
  Star,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "LESSONOS — AI Tutorial Generator | Create Lessons on Any Topic",
  description:
    "LESSONOS is the AI-powered tutorial generator that creates structured, in-depth lessons on any topic you ask. From programming to physics, get expert-quality learning content instantly.",
  keywords: [
    "AI tutorial generator",
    "AI lesson creator",
    "online learning",
    "structured lessons",
    "technical tutorials",
    "AI education",
    "learn anything",
    "tutorial maker",
  ],
  openGraph: {
    title: "LESSONOS — AI Tutorial Generator | Create Lessons on Any Topic",
    description:
      "Create structured, in-depth tutorials on any topic with AI. From programming to physics, get expert-quality learning content instantly.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://lessonos.com",
    siteName: "LESSONOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "LESSONOS — AI Tutorial Generator",
    description:
      "Create structured, in-depth tutorials on any topic with AI. Expert-quality learning content, instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LESSONOS",
  applicationCategory: "EducationalApplication",
  description:
    "AI-powered tutorial generator that creates structured lessons on any topic.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* ═══════════════════ HEADER ═══════════════════ */}
        <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <Link
              className="flex items-center space-x-2 font-bold tracking-tight text-lg"
              href="/"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-sm font-black">
                L
              </span>
              <span>LESSONOS</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
              <Link
                className="text-muted-foreground transition hover:text-foreground"
                href="#features"
              >
                Features
              </Link>
              <Link
                className="text-muted-foreground transition hover:text-foreground"
                href="#how-it-works"
              >
                How it Works
              </Link>
              <Link
                className="text-muted-foreground transition hover:text-foreground"
                href="#testimonials"
              >
                Testimonials
              </Link>
              <ModeToggle />
              <div className="h-4 w-px bg-border" />
              {session ? (
                <Link
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    className="text-muted-foreground transition hover:text-foreground"
                    href="/sign-in"
                  >
                    Sign In
                  </Link>
                  <Link
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                    href="/sign-up"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile menu */}
            <MobileNav session={!!session} />
          </div>
        </header>

        <main>
          {/* ═══════════════════ HERO SECTION ═══════════════════ */}
          <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6 pb-16 sm:pb-20 pt-24 sm:pt-32">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--secondary),transparent_70%)] opacity-50" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left: Copy */}
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium tracking-tight text-foreground animate-fade-in-up">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                  <span>AI-Powered Learning — Any Topic, Any Field</span>
                </div>

                <h1 className="text-5xl leading-[1.3] font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up animation-delay-100">
                  Learn anything.{" "}
                  <span className="notation-underline">Structured by AI.</span>
                  <br className="hidden sm:block" />
                  <span className="text-muted-foreground block">
                    Mastered by you.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in-up animation-delay-200">
                  Tell LESSONOS what you want to learn — from React hooks to
                  quantum physics — and get an expertly structured tutorial in
                  seconds. Edit, refine, and save lessons that actually stick.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start animate-fade-in-up animation-delay-300">
                  <Link
                    className="group rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl flex items-center gap-2"
                    href={session ? "/dashboard" : "/sign-up"}
                  >
                    {session ? "Go to Dashboard" : "Start Learning Free"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    className="rounded-lg border border-border bg-background px-8 py-4 text-sm font-semibold text-foreground transition hover:bg-muted"
                    href="#how-it-works"
                  >
                    See how it works
                  </Link>
                </div>
              </div>

              {/* Right: Hero Illustration */}
              <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-200">
                <div className="relative">
                  <div className="notation-card p-4">
                    <Image
                      src="/images/hero-illustration.png"
                      alt="AI generating structured lessons from any topic — notebook sketch showing person at laptop with organized content flowing from AI"
                      width={500}
                      height={500}
                      className="rounded-lg"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ SOCIAL PROOF BAR ═══════════════════ */}
          <section className="py-8 sm:py-12 border-y border-border bg-muted/20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground mb-6 sm:mb-8 tracking-wide uppercase">
                Trusted by learners and professionals worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 text-muted-foreground/60">
                <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <GraduationCap className="h-5 w-5" />
                  <span>10,000+ Lessons Created</span>
                </div>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <Globe className="h-5 w-5" />
                  <span>50+ Fields Covered</span>
                </div>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <Star className="h-5 w-5" />
                  <span>4.9/5 User Rating</span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ FEATURES SECTION ═══════════════════ */}
          <section
            id="features"
            className="py-16 sm:py-28 bg-background relative overflow-hidden"
          >
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              {/* Section Header */}
              <div className="mb-10 sm:mb-16 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium tracking-tight text-muted-foreground mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Powerful Features</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Everything you need to{" "}
                  <span className="notation-underline">master any topic</span>.
                </h2>
                <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
                  LESSONOS goes beyond simple Q&A. It creates structured,
                  persistent learning modules that adapt to your level.
                </p>
              </div>

              {/* ── Bento Grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ┌─ Hero Feature 1: Structured Generation ─┐ */}
                <div className="group relative notation-card overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="p-8 pb-0 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      <Wand2 className="h-3.5 w-3.5" />
                      Structured Generation
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      Lessons organized like a{" "}
                      <span className="notation-underline">real textbook</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                      Every lesson is intelligently split into intro, core
                      concepts, hands-on examples, and practice — authored by
                      AI, structured like an expert wrote it.
                    </p>
                  </div>
                  <div className="mt-6 px-8 pb-8">
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30">
                      <Image
                        src="/images/feature-structured.png"
                        alt="Notebook sketch showing document sections organized with labels and connecting arrows"
                        width={500}
                        height={350}
                        className="w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ┌─ Hero Feature 2: AI Editing ─┐ */}
                <div className="group relative notation-card overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="p-8 pb-0 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      <MessageSquare className="h-3.5 w-3.5" />
                      AI-Powered Editing
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      Refine any section with{" "}
                      <span className="notation-highlight">a single click</span>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                      Select any paragraph and ask the AI to expand, simplify,
                      add code examples, or translate it — your lessons evolve
                      with your understanding.
                    </p>
                  </div>
                  <div className="mt-6 px-8 pb-8">
                    <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30">
                      <Image
                        src="/images/feature-ai-editing.png"
                        alt="Sketched magic wand editing content on an open notebook with sparkle effects"
                        width={500}
                        height={350}
                        className="w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ┌─ Wide Feature: Any Topic ─┐ */}
                <div className="group md:col-span-2 notation-card overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 items-center">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        <Globe className="h-3.5 w-3.5" />
                        Unlimited Topics
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Any topic. Any field.{" "}
                        <span className="text-muted-foreground">
                          No limits.
                        </span>
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        From React hooks to quantum mechanics, from oil painting
                        to machine learning — if you can name it, LESSONOS can
                        teach it with depth and clarity.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 justify-center md:justify-end">
                      {[
                        { label: "React & Next.js", emoji: "⚛️" },
                        { label: "Python", emoji: "🐍" },
                        { label: "Quantum Physics", emoji: "⚛️" },
                        { label: "UI/UX Design", emoji: "🎨" },
                        { label: "Machine Learning", emoji: "🤖" },
                        { label: "Finance", emoji: "📊" },
                        { label: "Music Theory", emoji: "🎵" },
                        { label: "Biology", emoji: "🧬" },
                        { label: "Marketing", emoji: "📈" },
                        { label: "DevOps", emoji: "🔧" },
                        { label: "Philosophy", emoji: "🤔" },
                        { label: "History", emoji: "📜" },
                      ].map((tag) => (
                        <span
                          key={tag.label}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all duration-200 cursor-default"
                        >
                          <span>{tag.emoji}</span>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ┌─ Bottom Row: 3 compact features ─┐ */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Persistent Library */}
                  <div className="group notation-card p-8 flex flex-col items-center text-center">
                    <div className="mb-6 h-64 w-full relative overflow-hidden rounded-2xl">
                      <Image
                        src="/images/library.png"
                        alt="Persistent Library — Hand-drawn sketch of a notebook library"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">
                      Persistent Library
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                      Unlike chatbots, your lessons are saved forever. Build a
                      personal knowledge library you can revisit, edit, and
                      expand anytime.
                    </p>
                  </div>

                  {/* Instant Summaries */}
                  <div className="group notation-card p-8 flex flex-col items-center text-center">
                    <div className="mb-6 h-64 w-full relative overflow-hidden rounded-2xl">
                      <Image
                        src="/images/summaries.png"
                        alt="Instant Summaries — Hand-drawn sketch of quick takeaways"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">
                      Instant Summaries
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                      Get high-level takeaways and key points for every lesson —
                      perfect for quick review before meetings, exams, or
                      interviews.
                    </p>
                  </div>

                  {/* Multi-Difficulty */}
                  <div className="group notation-card p-8 flex flex-col items-center text-center">
                    <div className="mb-6 h-64 w-full relative overflow-hidden rounded-2xl">
                      <Image
                        src="/images/adaptive.png"
                        alt="Adaptive Difficulty — Hand-drawn sketch of different layers"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3 tracking-tight">
                      Adaptive Difficulty
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
                      Choose beginner, intermediate, or advanced — the AI adapts
                      depth, vocabulary, and examples to match your current
                      level perfectly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
          <section
            id="how-it-works"
            className="py-16 sm:py-28 bg-background border-y border-border"
          >
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-12 sm:mb-20 text-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  How It Works
                </h2>
                <p className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                  Three steps to{" "}
                  <span className="notation-highlight">mastery</span>.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
                {/* Left Column: Illustration (No Border) */}
                <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                  <div className="relative w-full max-w-md">
                    <Image
                      src="/images/how-it-works.png"
                      alt="Three-step flow diagram: Ask a question, AI generates lesson, Master the topic — drawn in notebook sketch style"
                      width={600}
                      height={600}
                      className="object-contain rounded-2xl"
                    />
                  </div>
                </div>

                {/* Right Column: Steps */}
                <div className="space-y-8 order-1 lg:order-2">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground text-background text-sm font-bold font-mono">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2">
                        Describe Your Topic
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Type any topic —{" "}
                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                          Explain Docker containers
                        </span>{" "}
                        or
                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded ml-1">
                          How does photosynthesis work?
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-foreground border border-border text-sm font-bold font-mono">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2">
                        AI Generates a Lesson
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Our AI creates a complete, structured tutorial with
                        sections, code examples, analogies, and key takeaways in
                        seconds.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-none">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-foreground border border-border text-sm font-bold font-mono">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight mb-2">
                        Edit, Refine & Master
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Review your lesson, use AI to edit specific sections,
                        and save it to your personal library for long-term
                        learning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
          <section id="testimonials" className="py-16 sm:py-28 bg-background">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-12 sm:mb-20 text-center">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Testimonials
                </h2>
                <p className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                  Loved by <span className="notation-underline">learners</span>{" "}
                  everywhere.
                </p>
              </div>

              <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
                {/* Testimonial 1 */}
                <div className="notation-card p-6 sm:p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    &quot;I used LESSONOS to learn Kubernetes in a week. The
                    structured lessons were 10x better than random blog posts.
                    The AI editing let me drill down into exactly what I
                    didn&apos;t understand.&quot;
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="font-semibold text-sm">Alex Chen</p>
                    <p className="text-xs text-muted-foreground">
                      Senior DevOps Engineer
                    </p>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="notation-card p-6 sm:p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    &quot;As a biology student, I needed clear summaries of
                    complex topics. LESSONOS generates lessons I can actually
                    save and review before exams. Game changer.&quot;
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="font-semibold text-sm">Sarah Mitchell</p>
                    <p className="text-xs text-muted-foreground">
                      Pre-Med Student, Stanford
                    </p>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="notation-card p-6 sm:p-8 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">
                    &quot;I&apos;m a self-taught developer and LESSONOS replaced
                    my entire bookmark folder. It&apos;s like having a personal
                    tutor that writes perfect notes for you.&quot;
                  </p>
                  <div className="pt-2 border-t border-border">
                    <p className="font-semibold text-sm">Omar Farouk</p>
                    <p className="text-xs text-muted-foreground">
                      Full-Stack Developer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════════════════ FINAL CTA ═══════════════════ */}
          <section className="py-20 sm:py-32 relative overflow-hidden bg-muted/20 border-t border-border">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,var(--secondary),transparent_70%)] opacity-40" />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
              {/* CTA Illustration */}
              <div className="flex justify-center mb-10">
                <Image
                  src="/images/cta-rocket.png"
                  alt="Sketch of a rocket launching from an open book, symbolizing accelerated learning"
                  width={280}
                  height={280}
                  className="rounded-lg"
                />
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Ready to{" "}
                <span className="notation-highlight">
                  accelerate your learning
                </span>
                ?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Join thousands of learners, developers, and students using
                LESSONOS to master new skills faster than ever. Your first
                lesson is free.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  className="group rounded-lg bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl flex items-center gap-2"
                  href={session ? "/dashboard" : "/sign-up"}
                >
                  {session ? "Go to Dashboard" : "Create My First Lesson"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="border-t border-border py-16 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-2 space-y-4">
                <Link
                  className="flex items-center space-x-2 font-bold tracking-tight text-lg"
                  href="/"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-sm font-black">
                    L
                  </span>
                  <span>LESSONOS</span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  The AI-powered tutorial generator that creates structured
                  lessons on any topic. Learn smarter, not harder.
                </p>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Product</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link
                    href="#features"
                    className="block hover:text-foreground transition"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="block hover:text-foreground transition"
                  >
                    How it Works
                  </Link>
                  <Link
                    href="#testimonials"
                    className="block hover:text-foreground transition"
                  >
                    Testimonials
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Account</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <Link
                    href="/sign-in"
                    className="block hover:text-foreground transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block hover:text-foreground transition"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block hover:text-foreground transition"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2026 LESSONOS. All rights reserved.</p>
              <p>
                Built with{" "}
                <span className="text-foreground font-medium">Next.js</span> and{" "}
                <span className="text-foreground font-medium">AI</span>.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
