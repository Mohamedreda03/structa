"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      await resetPassword({
        newPassword: password,
        token: token,
      });
      toast.success("Password reset successfully. You can now sign in.");
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-destructive">Invalid Link</CardTitle>
          <CardDescription>
            The password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/forget-password">Request new link</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border bg-card shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background border-input focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background border-input focus:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link className="text-primary font-medium hover:underline underline-offset-4" href="/forget-password">
            Back to forgot password
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
