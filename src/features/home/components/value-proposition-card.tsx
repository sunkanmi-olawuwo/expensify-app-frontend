import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

type ValuePropositionCardProps = {
  className?: string;
  description: string;
  icon: LucideIcon;
  title: string;
};

export function ValuePropositionCard({
  className,
  description,
  icon: Icon,
  title,
}: ValuePropositionCardProps) {
  return (
    <article
      className={cn(
        "bg-surface-container-low shadow-ambient-sm rounded-[var(--radius-shell)] p-6",
        className,
      )}
    >
      <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </div>
      <h2 className="text-title-lg text-foreground mt-6">{title}</h2>
      <p className="text-body-md text-muted-foreground mt-3 max-w-sm">
        {description}
      </p>
    </article>
  );
}
