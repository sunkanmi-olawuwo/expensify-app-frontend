import { PageHeader } from "@/ui/composite";

import { TransactionsFilterBar } from "../components/transactions-filter-bar";
import { TransactionsTable } from "../components/transactions-table";

export function TransactionsScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Use the transaction history sample as the tone guide for this page's spacing, labels, and pill-based state treatment."
        eyebrow="Transaction History"
        title="The table foundation should feel airy, precise, and export-ready."
      />
      <TransactionsFilterBar />
      <TransactionsTable />
    </div>
  );
}
