export type DashboardMoneyMetric = {
  amount: number;
  changePercentage: number;
  currency: string;
};

export type DashboardColorToken =
  | "primary"
  | "primary-fixed"
  | "secondary"
  | "destructive"
  | "outline";

export type SpendingBreakdownItem = {
  amount: number;
  category: string;
  colorToken: DashboardColorToken;
  percentageOfTotal: number;
};

export type MonthlyPerformancePoint = {
  expenses: number;
  income: number;
  month: string;
};

export type DashboardTransaction = {
  amount: number;
  category: string;
  currency: string;
  id: string;
  merchant: string;
  status: "Pending" | "Settled";
  timestamp: string;
  type: "income" | "expense";
};

export type DashboardSummary = {
  monthlyExpenses: DashboardMoneyMetric;
  monthlyIncome: DashboardMoneyMetric;
  monthlyPerformance: MonthlyPerformancePoint[];
  netCashFlow: DashboardMoneyMetric;
  recentTransactions: DashboardTransaction[];
  spendingBreakdown: SpendingBreakdownItem[];
};

const now = Date.now();

export const dashboardSummaryQueryKey = ["dashboard", "summary"] as const;

export const dashboardSummaryMockData: DashboardSummary = {
  monthlyExpenses: {
    amount: 9284,
    changePercentage: -3.4,
    currency: "USD",
  },
  monthlyIncome: {
    amount: 18450,
    changePercentage: 8.2,
    currency: "USD",
  },
  monthlyPerformance: [
    { expenses: 8120, income: 16240, month: "Oct" },
    { expenses: 8540, income: 16890, month: "Nov" },
    { expenses: 8895, income: 17150, month: "Dec" },
    { expenses: 9022, income: 17640, month: "Jan" },
    { expenses: 9610, income: 17030, month: "Feb" },
    { expenses: 9284, income: 18450, month: "Mar" },
  ],
  netCashFlow: {
    amount: 9166,
    changePercentage: 12.4,
    currency: "USD",
  },
  recentTransactions: [
    {
      amount: 228,
      category: "Dining / Team",
      currency: "USD",
      id: "txn_1",
      merchant: "Maison et Table",
      status: "Settled",
      timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      type: "expense",
    },
    {
      amount: 5200,
      category: "Revenue / Retainer",
      currency: "USD",
      id: "txn_2",
      merchant: "Northshore Studio",
      status: "Settled",
      timestamp: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      type: "income",
    },
    {
      amount: 84,
      category: "SaaS / Subscriptions",
      currency: "USD",
      id: "txn_3",
      merchant: "Prototype Cloud",
      status: "Pending",
      timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "expense",
    },
    {
      amount: 640,
      category: "Travel / Rail",
      currency: "USD",
      id: "txn_4",
      merchant: "West Coast Rail",
      status: "Settled",
      timestamp: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "expense",
    },
    {
      amount: 1420,
      category: "Consulting / Project",
      currency: "USD",
      id: "txn_5",
      merchant: "Atelier North",
      status: "Settled",
      timestamp: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: "income",
    },
  ],
  spendingBreakdown: [
    {
      amount: 2840,
      category: "Housing",
      colorToken: "primary",
      percentageOfTotal: 30.6,
    },
    {
      amount: 1625,
      category: "Travel",
      colorToken: "primary-fixed",
      percentageOfTotal: 17.5,
    },
    {
      amount: 1490,
      category: "Dining",
      colorToken: "secondary",
      percentageOfTotal: 16.1,
    },
    {
      amount: 1240,
      category: "Software",
      colorToken: "destructive",
      percentageOfTotal: 13.4,
    },
    {
      amount: 980,
      category: "Utilities",
      colorToken: "outline",
      percentageOfTotal: 10.6,
    },
  ],
};
