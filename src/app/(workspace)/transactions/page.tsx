import { TransactionsScreen } from "@/features/transactions";

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return <TransactionsScreen />;
}
