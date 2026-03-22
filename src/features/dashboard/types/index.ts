export type DashboardMetric = {
  change: string;
  label: string;
  value: string;
};

export type LedgerEntry = {
  amount: string;
  category: string;
  merchant: string;
  status: string;
  timeAgo: string;
  tone: "income" | "expense";
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    change: "+8.2% vs. February",
    label: "Monthly income",
    value: "$18,450.00",
  },
  {
    change: "-3.4% vs. February",
    label: "Monthly expenses",
    value: "$9,284.00",
  },
  {
    change: "Healthy runway signal",
    label: "Net cash flow",
    value: "$9,166.00",
  },
];

export const quickActions = [
  "Send Money",
  "Add Funds",
  "Import Recurring",
  "Review AI Draft",
] as const;

export const recentLedgerEntries: LedgerEntry[] = [
  {
    amount: "-$228.00",
    category: "Dining / Team",
    merchant: "Maison et Table",
    status: "Settled",
    timeAgo: "2h ago",
    tone: "expense",
  },
  {
    amount: "+$5,200.00",
    category: "Revenue / Retainer",
    merchant: "Northshore Studio",
    status: "Approved",
    timeAgo: "Yesterday",
    tone: "income",
  },
  {
    amount: "-$84.00",
    category: "SaaS / Subscriptions",
    merchant: "Prototype Cloud",
    status: "Approved",
    timeAgo: "2 days ago",
    tone: "expense",
  },
];
