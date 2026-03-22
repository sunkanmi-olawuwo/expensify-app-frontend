export type SpendingCategory = {
  name: string;
  share: string;
};

export const spendingBreakdown: SpendingCategory[] = [
  { name: "Housing", share: "31%" },
  { name: "Lifestyle", share: "24%" },
  { name: "Investments", share: "19%" },
  { name: "Food & Dining", share: "12%" },
];
