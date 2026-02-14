"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface UserNavProps {
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="hidden sm:inline">Hi, {user.name?.split(" ")[0] || "User"}</span>
        <div className="h-8 w-8 rounded-full bg-primary/10 text-center text-xs font-bold leading-8 text-primary uppercase">
          {user.name?.[0] || user.email[0]}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        onClick={handleSignOut}
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
