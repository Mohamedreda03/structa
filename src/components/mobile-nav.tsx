"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  session: boolean;
}

export function MobileNav({ session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        className="md:hidden relative z-50 p-2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleOpen}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Full Screen Menu Overlay - Highest Z-Index */}
      {(isOpen || isClosing) && (
        <div
          className={cn(
            "fixed inset-0 z-9999 bg-background flex flex-col w-screen h-screen md:hidden",
            isClosing
              ? "animate-out slide-out-to-right-full duration-300"
              : "animate-in slide-in-from-right-full duration-300",
          )}
        >
          {/* Header inside menu for closing */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10000">
            <span className="font-bold text-xl tracking-tight">Menu</span>
            <button
              onClick={handleClose}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-md active:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8 bg-background">
            <nav className="flex flex-col gap-6">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How it Works" },
                { href: "#testimonials", label: "Testimonials" },
              ].map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className="text-3xl font-bold tracking-tight text-foreground hover:text-primary transition-colors active:scale-95 origin-left"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="h-px w-full bg-border/60" />

            <div className="flex items-center justify-between py-2">
              <span className="text-lg font-medium text-muted-foreground">
                Appearance
              </span>
              <ModeToggle />
            </div>

            <div className="mt-auto flex flex-col gap-4 pb-8 w-full">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={handleClose}
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full text-lg h-14 font-semibold"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    onClick={handleClose}
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="w-full text-lg h-14 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link
                    href="/sign-in"
                    onClick={handleClose}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-lg h-14 font-semibold border-2"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
