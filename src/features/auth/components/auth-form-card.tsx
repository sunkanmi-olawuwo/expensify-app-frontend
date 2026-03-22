import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type AuthFormCardProps = {
  children: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function AuthFormCard({
  children,
  className,
  description,
  title,
}: AuthFormCardProps) {
  return (
    <section
      className={cn(
        "bg-surface shadow-ambient-md w-full max-w-md rounded-[var(--radius-shell)] p-8",
        className,
      )}
    >
      <div className="space-y-3">
        <h1 className="text-headline-md text-foreground">{title}</h1>
        <p className="text-body-md text-muted-foreground">{description}</p>
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
