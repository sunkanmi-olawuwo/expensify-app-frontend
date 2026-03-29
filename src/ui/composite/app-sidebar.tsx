"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";

import {
  AdminSectionIcon,
  adminNavItems,
  isRouteActive,
  primaryNavItems,
} from "@/lib/app-shell";
import type { NavItem } from "@/lib/app-shell";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

function NavItems({
  items,
  onNavigate,
  pathname,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  pathname: string | null;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = isRouteActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            aria-current={isActive ? "page" : undefined}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "text-body-md text-muted-foreground hover:bg-surface-container-low hover:text-foreground flex items-center gap-3 rounded-full px-4 py-3 transition-colors",
              isActive &&
                "text-primary bg-[color:var(--sidebar-accent)] shadow-[inset_0_0_0_1px_var(--ghost-border)]",
            )}
          >
            {Icon ? (
              <span
                className={cn(
                  "bg-surface-container-low text-muted-foreground flex size-10 items-center justify-center rounded-full",
                  isActive && "bg-surface-bright text-primary",
                )}
              >
                <Icon className="size-5" />
              </span>
            ) : null}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const adminNavLabelId = useId();

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
      </div>

      {isAdmin ? (
        <div className="space-y-3 pr-2">
          <div className="text-muted-foreground flex items-center gap-2 px-4">
            <AdminSectionIcon aria-hidden="true" className="size-4" />
            <p className="text-label-sm" id={adminNavLabelId}>
              Administration
            </p>
          </div>

          <nav aria-labelledby={adminNavLabelId} className="space-y-2">
            <NavItems
              items={adminNavItems}
              onNavigate={onNavigate}
              pathname={pathname}
            />
          </nav>
        </div>
      ) : (
        <nav aria-label="Primary navigation" className="space-y-2 pr-2">
          <NavItems
            items={primaryNavItems}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        </nav>
      )}

      {isAdmin ? (
        <div className="space-y-3 pr-2">
          <div className="text-muted-foreground flex items-center gap-2 px-4">
            <AdminSectionIcon aria-hidden="true" className="size-4" />
            <p className="text-label-sm" id={adminNavLabelId}>
              Administration
            </p>
          </div>

          <nav aria-labelledby={adminNavLabelId} className="space-y-2">
            <NavItems
              items={adminNavItems}
              onNavigate={onNavigate}
              pathname={pathname}
            />
          </nav>
        </div>
      ) : null}

      <div className="mt-auto space-y-4 pr-2">
        <ThemeToggle switchStyle />

        <div className="space-y-2">
          <button
            className="text-body-md text-muted-foreground hover:bg-surface-container-low hover:text-foreground flex w-full items-center gap-3 rounded-full px-3 py-2 transition-colors"
            onClick={() => void logout()}
            type="button"
          >
            <LogOut aria-hidden="true" className="size-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
