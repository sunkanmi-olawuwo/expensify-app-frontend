import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  MessageSquareText,
  Settings2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type AppRoute =
  | "/dashboard"
  | "/transactions"
  | "/analytics"
  | "/settings"
  | "/chat";

export type NavItem = {
  href: Exclude<AppRoute, "/chat">;
  icon: LucideIcon;
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
  {
    href: "/settings",
    icon: Settings2,
    label: "Settings",
  },
];

const pageChromeByRoute: Record<AppRoute, PageChrome> = {
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
    eyebrow: "Personal Finance",
    searchPlaceholder: "Search dashboard...",
    title: "A monthly story, not a spreadsheet.",
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

export function getPageChrome(pathname: string | null): PageChrome {
  if (!pathname) {
    return pageChromeByRoute["/dashboard"];
  }

  if (pathname in pageChromeByRoute) {
    return pageChromeByRoute[pathname as AppRoute];
  }

  return pageChromeByRoute["/dashboard"];
}

export const hiddenRoutes: AppRoute[] = ["/chat"];

export const chatRoute = {
  href: "/chat" as const,
  icon: MessageSquareText,
  label: "Chat",
};
