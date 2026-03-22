import { cn } from "@/lib/utils";

import type { ReactNode } from "react";


type SurfaceCardProps = {
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  title?: string;
  tone?: "default" | "hero" | "subtle";
};

const toneClasses: Record<NonNullable<SurfaceCardProps["tone"]>, string> = {
  default: "bg-card text-card-foreground shadow-ambient-sm",
  hero: "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-primary-foreground shadow-ambient-lg",
  subtle: "bg-surface-container-low text-card-foreground shadow-none",
};

export function SurfaceCard({
  action,
  children,
  className,
  description,
  eyebrow,
  title,
  tone = "default",
}: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-shell)] p-6",
        toneClasses[tone],
        className,
      )}
    >
      {(eyebrow || title || description || action) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            {eyebrow ? (
              <p
                className={cn(
                  "text-label-sm",
                  tone === "hero" ? "text-white/72" : "text-muted-foreground",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                className={cn(
                  "text-title-lg",
                  tone === "hero" ? "text-white" : "text-foreground",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "text-body-md max-w-xl",
                  tone === "hero" ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children ? (
        <div className={cn(title || description || eyebrow ? "mt-6" : "")}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
