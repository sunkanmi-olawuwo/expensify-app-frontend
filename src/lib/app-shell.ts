import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  Shield,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type PageChromeRoute =
  | "/dashboard"
  | "/transactions"
  | "/analytics"
  | "/settings"
  | "/chat"
  | "/admin/users"
  | "/admin/users/[userId]"
  | "/admin/catalogs";

export type SidebarRoute =
  | "/dashboard"
  | "/transactions"
  | "/analytics"
  | "/admin/users"
  | "/admin/catalogs";

export type NavItem = {
  href: SidebarRoute;
  icon?: LucideIcon;
  label: string;
};

export type PageChrome = {
  description: string;
  eyebrow: string;
  searchPlaceholder: string;
  title: string;
};

export const primaryNavItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/transactions",
    icon: CreditCard,
    label: "Transactions",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
];

export const adminNavItems: NavItem[] = [
  {
    href: "/admin/users",
    label: "Users",
  },
  {
    href: "/admin/catalogs",
    label: "Catalogs",
  },
];

const pageChromeByRoute: Record<PageChromeRoute, PageChrome> = {
  "/admin/catalogs": {
    description:
      "Manage shared preference catalogs and prepare the foundation for admin-only configuration workflows.",
    eyebrow: "Administration",
    searchPlaceholder: "Search catalogs...",
    title: "System Catalogs",
  },
  "/admin/users": {
    description:
      "Review the user directory, permissions, and future moderation tooling from one controlled workspace.",
    eyebrow: "Administration",
    searchPlaceholder: "Search users...",
    title: "User Management",
  },
  "/admin/users/[userId]": {
    description:
      "Inspect an individual workspace once the admin drill-down for expenses, income, and summaries is connected.",
    eyebrow: "Administration",
    searchPlaceholder: "Search user records...",
    title: "User Detail",
  },
  "/analytics": {
    description:
      "Track momentum, category drift, and monthly cash rhythm through editorial visualizations.",
    eyebrow: "Visual Analytics",
    searchPlaceholder: "Search analytics...",
    title: "Capital movement with context.",
  },
  "/chat": {
    description:
      "Reserve a data-grounded AI assistant surface for personal finance questions without exposing it in the primary nav until product design is ready.",
    eyebrow: "Private Assistant",
    searchPlaceholder: "Search finance questions...",
    title: "AI chat stays real and data-backed.",
  },
  "/dashboard": {
    description:
      "Anchor the month around available capital, recurring flows, and the ledger items that need attention now.",
    eyebrow: "Personal Finance Dashboard",
    searchPlaceholder: "Search ...",
    title: "",
  },
  "/settings": {
    description:
      "Keep core preferences centralized so currency, timezone, and monthly behavior stay predictable.",
    eyebrow: "Preferences",
    searchPlaceholder: "Search settings...",
    title: "Tune the workspace before the data layer lands.",
  },
  "/transactions": {
    description:
      "Shape the future CRUD surface around filters, exports, and high-signal transaction review states.",
    eyebrow: "Transaction History",
    searchPlaceholder: "Search transactions...",
    title: "Review the ledger without visual noise.",
  },
};

function resolvePageChromeRoute(pathname: string): PageChromeRoute | null {
  if (pathname in pageChromeByRoute) {
    return pathname as PageChromeRoute;
  }

  if (/^\/admin\/users\/[^/]+$/.test(pathname)) {
    return "/admin/users/[userId]";
  }

  return null;
}

export function getPageChrome(pathname: string | null): PageChrome {
  if (!pathname) {
    return pageChromeByRoute["/dashboard"];
  }

  const route = resolvePageChromeRoute(pathname);

  if (route) {
    return pageChromeByRoute[route];
  }

  return pageChromeByRoute["/dashboard"];
}

export const hiddenRoutes: PageChromeRoute[] = ["/chat"];

export const chatRoute = {
  href: "/chat" as const,
  icon: MessageSquareText,
  label: "Chat",
};

export function isRouteActive(
  pathname: string | null,
  href: string,
): boolean {
  if (!pathname) return false;
  if (href === "/admin/users") {
    return pathname === href || pathname.startsWith("/admin/users/");
  }
  return pathname === href;
}

export const AdminSectionIcon = Shield;
