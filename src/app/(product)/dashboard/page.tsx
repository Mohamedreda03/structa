import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userLessons = await db.query.lessons.findMany({
    where: eq(lessons.userId, session.user.id),
    orderBy: [desc(lessons.createdAt)],
    with: {
      sections: true,
    },
  });

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Lessons</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your learning modules.
          </p>
        </div>
        <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
          <Link href="/lessons/new">
            <Plus className="mr-2 h-4 w-4" />
            New Lesson
          </Link>
        </Button>
      </div>

      {userLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center bg-muted/30">
          <h3 className="text-lg font-medium text-foreground">No lessons created yet</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Get started by creating your first AI-generated lesson.
          </p>
          <Button asChild className="mt-6" size="sm">
            <Link href="/lessons/new">Create Lesson</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userLessons.map((lesson) => (
            <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group block h-full">
              <Card className="h-full transition-all hover:shadow-md border-border hover:border-foreground/20 bg-card">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {lesson.topic}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground font-medium">
                      {lesson.difficulty}
                    </span>
                    <span>{new Date(lesson.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
