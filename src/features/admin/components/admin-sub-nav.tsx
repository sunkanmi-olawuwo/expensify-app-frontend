"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isRouteActive } from "@/lib/app-shell";
import { cn } from "@/lib/utils";

const adminSubNavItems = [
  {
    href: "/admin/users",
    label: "Users",
  },
  {
    href: "/admin/catalogs",
    label: "Catalogs",
  },
] as const;

export function AdminSubNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Administration" className="px-2">
      <div className="bg-surface-container-low inline-flex flex-wrap gap-2 rounded-full p-2">
        {adminSubNavItems.map((item) => {
          const isActive = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "text-body-md text-muted-foreground hover:bg-surface-container hover:text-foreground rounded-full px-4 py-2.5 transition-colors",
                isActive &&
                  "bg-surface-container text-foreground shadow-ambient-sm",
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
