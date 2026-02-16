"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFooter } from "@/components/auth/auth-footer";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      setIsSent(true);
      toast.success("Reset link sent to your email.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link. Please check the email address.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthCard
        title="Check your email"
        description={`We've sent a password reset link to ${email}.`}
      >
        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      description="Enter your email and we'll send you a link to reset your password."
    >
      <form onSubmit={handleForgetPassword} className="space-y-4">
        <fieldset disabled={isLoading} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background border-input focus:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </fieldset>
      </form>
      <AuthFooter text="" linkText="Back to sign in" href="/sign-in" />
    </AuthCard>
  );
}
