import {
  BanknoteArrowUp,
  BriefcaseBusiness,
  HandCoins,
  House,
  Landmark,
  type LucideIcon,
  Plane,
  Receipt,
  Send,
  Sparkles,
  UtensilsCrossed,
  WalletCards,
  Zap,
} from "lucide-react";

import type {
  DashboardColorToken,
  DashboardMoneyMetric,
  DashboardTransaction,
  SpendingBreakdownItem,
} from "./types";

type QuickAction = {
  detail: string;
  description: string;
  icon: LucideIcon;
  label: string;
};

const currencyFormatters = new Map<string, Intl.NumberFormat>();
const compactCurrencyFormatters = new Map<string, Intl.NumberFormat>();
const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const spendingIconByCategory: Record<string, LucideIcon> = {
  Dining: UtensilsCrossed,
  Housing: House,
  Software: Sparkles,
  Travel: Plane,
  Utilities: Zap,
};

const transactionIconByCategory: Record<string, LucideIcon> = {
  "Consulting / Project": BriefcaseBusiness,
  "Dining / Team": UtensilsCrossed,
  "Revenue / Retainer": Landmark,
  "SaaS / Subscriptions": Sparkles,
  "Travel / Rail": Plane,
};

export const dashboardQuickActions: QuickAction[] = [
  {
    description:
      "Transfer funds to another account or payee when payments are enabled.",
    detail: "Move money",
    icon: Send,
    label: "Send Money",
  },
  {
    description:
      "Move money into the account from a linked source when funding flows are available.",
    detail: "Add balance",
    icon: WalletCards,
    label: "Add Funds",
  },
  {
    description:
      "Capture a new expense without leaving the dashboard once quick entry is available.",
    detail: "Record spend",
    icon: Receipt,
    label: "Quick Add Expense",
  },
  {
    description:
      "Review suggested categorizations before posting automated drafts.",
    detail: "Review drafts",
    icon: BanknoteArrowUp,
    label: "Review AI Draft",
  },
];

export function formatCurrency(amount: number, currency: string) {
  let formatter = currencyFormatters.get(currency);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      currency,
      minimumFractionDigits: 2,
      style: "currency",
    });
    currencyFormatters.set(currency, formatter);
  }

  return formatter.format(amount);
}

export function formatCompactCurrency(amount: number, currency: string) {
  let formatter = compactCurrencyFormatters.get(currency);

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      currency,
      maximumFractionDigits: 1,
      notation: "compact",
      style: "currency",
    });
    compactCurrencyFormatters.set(currency, formatter);
  }

  return formatter.format(amount);
}

export function formatSignedMetricChange(metric: DashboardMoneyMetric) {
  const formattedValue = Math.abs(metric.changePercentage).toFixed(1);
  const prefix = metric.changePercentage >= 0 ? "+" : "-";

  return `${prefix}${formattedValue}% vs last month`;
}

export function formatTransactionAmount(transaction: DashboardTransaction) {
  const formatted = formatCurrency(transaction.amount, transaction.currency);
  const prefix = transaction.type === "income" ? "+" : "-";

  return `${prefix}${formatted}`;
}

export function formatRelativeTime(timestamp: string, now = new Date()) {
  const value = new Date(timestamp).getTime() - now.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (Math.abs(value) < hour) {
    return relativeTimeFormatter.format(Math.round(value / minute), "minute");
  }

  if (Math.abs(value) < day) {
    return relativeTimeFormatter.format(Math.round(value / hour), "hour");
  }

  if (Math.abs(value) < week) {
    return relativeTimeFormatter.format(Math.round(value / day), "day");
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(timestamp));
}

export function getSpendingTokenClasses(colorToken: DashboardColorToken) {
  switch (colorToken) {
    case "destructive":
      return {
        container: "bg-destructive/12 text-destructive",
        fill: "bg-destructive",
      };
    case "outline":
      return {
        container: "bg-surface-container-high text-muted-foreground",
        fill: "bg-outline-variant",
      };
    case "primary":
      return {
        container: "bg-primary/10 text-primary",
        fill: "bg-primary",
      };
    case "primary-fixed":
      return {
        container: "bg-primary-fixed/14 text-primary",
        fill: "bg-primary-fixed",
      };
    case "secondary":
    default:
      return {
        container: "bg-secondary/12 text-secondary",
        fill: "bg-secondary",
      };
  }
}

export function getSpendingIcon(item: SpendingBreakdownItem) {
  return spendingIconByCategory[item.category] ?? HandCoins;
}

export function getTransactionIcon(transaction: DashboardTransaction) {
  return transactionIconByCategory[transaction.category] ?? HandCoins;
}
