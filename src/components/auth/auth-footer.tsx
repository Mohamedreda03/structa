"use client";

import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <div className="mt-4 text-center text-sm">
      {text}{" "}
      <Link
        className="text-primary font-medium hover:underline underline-offset-4"
        href={href}
      >
        {linkText}
      </Link>
    </div>
  );
}
