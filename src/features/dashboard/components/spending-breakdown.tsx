import { SurfaceCard } from "@/ui/composite";

import {
  formatCurrency,
  getSpendingIcon,
  getSpendingTokenClasses,
} from "../utils";

import type { DashboardSummary } from "../types";

type SpendingBreakdownProps = {
  summary: DashboardSummary;
};

export function SpendingBreakdown({ summary }: SpendingBreakdownProps) {
  return (
    <SurfaceCard
      description="Largest expense categories this month"
      eyebrow="Spending Breakdown"
      title="Top categories"
    >
      <div className="space-y-3">
        {summary.spendingBreakdown.map((item) => {
          const Icon = getSpendingIcon(item);
          const tones = getSpendingTokenClasses(item.colorToken);

          return (
            <article
              key={item.category}
              className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-full ${tones.container}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-body-md font-semibold text-foreground">
                      {item.category}
                    </p>
                    <p className="text-body-md text-muted-foreground">
                      {item.percentageOfTotal.toFixed(1)}% of expenses
                    </p>
                  </div>
                </div>

                <p className="text-body-md font-semibold text-foreground">
                  {formatCurrency(item.amount, summary.monthlyExpenses.currency)}
                </p>
              </div>

              <div className="bg-surface-container-high mt-3 h-2 overflow-hidden rounded-full">
                <div
                  aria-label={`${item.category} share`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={item.percentageOfTotal}
                  className={`h-full rounded-full ${tones.fill}`}
                  role="progressbar"
                  style={{ width: `${Math.min(item.percentageOfTotal, 100)}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
