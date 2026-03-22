"use client";

import { ArrowUpRight, LifeBuoy, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/lib/app-shell";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/ui/base";

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-sidebar shadow-ambient-sm flex h-full flex-col gap-8 rounded-[var(--radius-shell)] px-5 py-6",
        className,
      )}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="font-display text-foreground text-xl font-semibold tracking-[-0.06em]">
            expensify
          </p>
          <p className="text-label-sm text-muted-foreground">
            Personal finance workspace
          </p>
        </div>
        <p className="text-body-md text-muted-foreground max-w-[15rem]">
          A purpose-built shell for the personal finance experience defined in
          the design system.
        </p>
      </div>

      <nav aria-label="Primary navigation" className="space-y-2">
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "text-body-md text-muted-foreground hover:bg-surface-container-low hover:text-foreground flex items-center gap-3 rounded-full px-4 py-3 transition-colors",
                isActive &&
                  "text-primary bg-[color:var(--sidebar-accent)] shadow-[inset_0_0_0_1px_var(--ghost-border)]",
              )}
            >
              <span
                className={cn(
                  "bg-surface-container-low text-muted-foreground flex size-10 items-center justify-center rounded-full",
                  isActive && "text-primary bg-white",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-6">
        <div className="text-primary-foreground shadow-ambient-lg rounded-[calc(var(--radius-shell)-0.35rem)] bg-[linear-gradient(140deg,var(--primary),var(--primary-container))] p-5">
          <Badge className="bg-white/18 text-white hover:bg-white/18">
            Pro Feature
          </Badge>
          <h2 className="text-title-lg mt-4 text-white">
            Upgrade to deeper personal finance insights.
          </h2>
          <p className="text-body-md mt-2 text-white/82">
            Preserve this card as the shell-level CTA while product features
            mature underneath it.
          </p>
          <Button className="text-primary mt-5 w-full bg-white hover:bg-white/92">
            Upgrade now
            <ArrowUpRight className="size-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <button
            className="text-body-md text-muted-foreground hover:bg-surface-container-low hover:text-foreground flex w-full items-center gap-3 rounded-full px-3 py-2 transition-colors"
            type="button"
          >
            <LifeBuoy className="size-4" />
            Support
          </button>
          <button
            className="text-body-md text-muted-foreground hover:bg-surface-container-low hover:text-foreground flex w-full items-center gap-3 rounded-full px-3 py-2 transition-colors"
            type="button"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
