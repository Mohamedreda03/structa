import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Restored Beautiful Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_60%)] blur-3xl opacity-50 dark:opacity-30" />
      <div className="pointer-events-none absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_60%)] blur-3xl opacity-50 dark:opacity-20" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
