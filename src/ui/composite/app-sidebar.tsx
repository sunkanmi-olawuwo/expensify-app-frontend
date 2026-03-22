"use client";

import { LifeBuoy, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNavItems } from "@/lib/app-shell";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={cn(
        "sidebar-scrollbar bg-sidebar shadow-ambient-sm flex h-full min-h-0 flex-col gap-8 overflow-y-auto rounded-[var(--radius-shell)] px-5 py-6 pr-3",
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

      <nav aria-label="Primary navigation" className="space-y-2 pr-2">
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

      <div className="mt-auto pr-2">
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
            onClick={() => void logout()}
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
