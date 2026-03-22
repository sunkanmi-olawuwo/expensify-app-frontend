import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/ui/composite";

import { transactionRows } from "../types";

export function TransactionsTable() {
  return (
    <SurfaceCard
      description="A spacing-led table scaffold with soft status pills and no hard dividers."
      eyebrow="Ledger Table"
      title="Transaction history"
    >
      <div className="space-y-4 md:hidden">
        {transactionRows.map((row) => (
          <article
            key={`${row.description}-${row.date}-mobile`}
            className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="text-body-md text-foreground font-semibold">
                  {row.description}
                </p>
                <p className="text-body-md text-muted-foreground">
                  {row.category}
                </p>
              </div>
              <span
                className={
                  row.amount.startsWith("+")
                    ? "text-title-lg text-secondary"
                    : "text-title-lg text-destructive"
                }
              >
                {row.amount}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-label-sm text-muted-foreground">{row.date}</p>
              <span
                className={cn(
                  "text-label-sm inline-flex rounded-full px-3 py-1",
                  row.status === "Completed"
                    ? "bg-secondary/12 text-secondary"
                    : "bg-surface-container-high text-foreground",
                )}
              >
                {row.status}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-label-sm text-muted-foreground text-left">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Description & Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactionRows.map((row) => (
              <tr
                key={`${row.description}-${row.date}`}
                className="bg-surface-container-low"
              >
                <td className="text-body-md text-foreground rounded-l-[1.25rem] px-4 py-4">
                  {row.date}
                </td>
                <td className="px-4 py-4">
                  <p className="text-body-md text-foreground font-semibold">
                    {row.description}
                  </p>
                  <p className="text-body-md text-muted-foreground">
                    {row.category}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "text-label-sm inline-flex rounded-full px-3 py-1",
                      row.status === "Completed"
                        ? "bg-secondary/12 text-secondary"
                        : "bg-surface-container-high text-foreground",
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="text-title-lg text-foreground rounded-r-[1.25rem] px-4 py-4 text-right">
                  <span
                    className={
                      row.amount.startsWith("+")
                        ? "text-secondary"
                        : "text-destructive"
                    }
                  >
                    {row.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SurfaceCard>
  );
}
