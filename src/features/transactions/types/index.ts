export type TransactionFilter = {
  label: string;
  value: string;
};

export type TransactionRow = {
  amount: string;
  category: string;
  date: string;
  description: string;
  status: string;
};

export const transactionFilters: TransactionFilter[] = [
  { label: "Date range", value: "March 1 - March 31" },
  { label: "Category", value: "All categories" },
  { label: "Payment method", value: "All methods" },
];

export const transactionRows: TransactionRow[] = [
  {
    amount: "-$84.00",
    category: "Subscriptions",
    date: "Mar 18, 2026",
    description: "Prototype Cloud",
    status: "Completed",
  },
  {
    amount: "-$228.00",
    category: "Dining",
    date: "Mar 17, 2026",
    description: "Maison et Table",
    status: "Pending",
  },
  {
    amount: "+$5,200.00",
    category: "Revenue",
    date: "Mar 16, 2026",
    description: "Northshore Studio",
    status: "Completed",
  },
];
