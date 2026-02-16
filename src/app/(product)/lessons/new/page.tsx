"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLessonAction } from "@/app/actions/generate-lesson";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function GenerateLessonPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await createLessonAction(formData);
      if (result?.error) {
        toast.error(result.error);
        setIsGenerating(false);
      }
    } catch {
      // redirect() throws internally — expected on success
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 sm:p-6">
      <div className="max-w-xl w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Create New Lesson
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Use AI to generate a structured lesson plan on any topic.
          </p>
        </div>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Details</CardTitle>
            <CardDescription>
              Define the scope and difficulty of your lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g. Advanced TypeScript Patterns"
                  className="bg-background border-input focus:ring-ring focus:border-ring placeholder:text-muted-foreground/50 h-11 text-base sm:text-sm sm:h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select defaultValue="intermediate" name="difficulty">
                  <SelectTrigger
                    id="difficulty"
                    className="w-full bg-background border-input focus:ring-ring focus:border-ring h-11 text-base sm:text-sm sm:h-10"
                  >
                    <SelectValue placeholder="Choose difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="English" name="language">
                  <SelectTrigger
                    id="language"
                    className="w-full bg-background border-input focus:ring-ring focus:border-ring h-11 text-base sm:text-sm sm:h-10"
                  >
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3 sm:pt-4">
                <Button
                  className="w-full h-11 sm:h-10 text-base sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  disabled={isGenerating}
                  type="submit"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Lesson"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isGenerating && (
          <div className="text-center space-y-3 animate-pulse text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
            <p className="font-medium text-foreground">
              Creating your lesson...
            </p>
            <p>This usually takes 10-20 seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
