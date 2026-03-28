import Link from "next/link";

import { Badge } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import {
  formatRelativeTime,
  formatTransactionAmount,
  getSpendingTokenClasses,
  getTransactionIcon,
} from "../utils";

import type { DashboardSummary } from "../types";

type RecentTransactionsProps = {
  summary: DashboardSummary;
};

export function RecentTransactions({ summary }: RecentTransactionsProps) {
  return (
    <SurfaceCard
      action={
        <Link
          className="text-label-sm text-primary hover:text-primary-container"
          href="/transactions"
        >
          View all transactions
        </Link>
      }
      className="shadow-ambient-md"
      description="Most recent posted and pending entries"
      eyebrow="Recent Transactions"
      title="Last 5 transactions"
    >
      <div className="space-y-3">
        {summary.recentTransactions.map((transaction) => {
          const Icon = getTransactionIcon(transaction);
          const iconTone =
            transaction.type === "income"
              ? getSpendingTokenClasses("secondary")
              : getSpendingTokenClasses("primary-fixed");

          return (
            <article
              key={transaction.id}
              className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-full ${iconTone.container}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-body-md font-semibold text-foreground">
                      {transaction.merchant}
                    </p>
                    <p className="text-body-md text-muted-foreground">
                      {transaction.category}
                    </p>
                    <p className="text-label-sm text-muted-foreground">
                      {formatRelativeTime(transaction.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={
                      transaction.type === "income"
                        ? "text-body-md font-semibold text-secondary"
                        : "text-body-md font-semibold text-destructive"
                    }
                  >
                    {formatTransactionAmount(transaction)}
                  </p>
                  <Badge
                    className="mt-2"
                    variant={
                      transaction.status === "Settled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
