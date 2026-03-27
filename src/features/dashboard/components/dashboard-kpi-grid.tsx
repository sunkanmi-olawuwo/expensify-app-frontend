import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { formatCurrency } from "../utils";

import type { DashboardSummary } from "../types";

type DashboardKpiGridProps = {
  summary: DashboardSummary;
};

type KpiCardProps = {
  changePercentage: number;
  currency: string;
  label: string;
  value: number;
};

function KpiCard({ changePercentage, currency, label, value }: KpiCardProps) {
  const isPositive = changePercentage >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
  const signedChange = `${isPositive ? "+" : "-"}${Math.abs(
    changePercentage,
  ).toFixed(1)}%`;

  return (
    <article className="bg-card shadow-ambient-sm rounded-[calc(var(--radius-shell)-0.35rem)] grid min-h-56 grid-rows-[auto_auto_1fr] gap-5 p-5">
      <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {label}
      </p>
      <div className="flex items-center justify-start">
        <div
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isPositive
              ? "bg-secondary/12 text-secondary"
              : "bg-destructive/10 text-destructive",
          )}
        >
          <TrendIcon aria-hidden="true" className="size-3.5" />
          <span>{signedChange}</span>
        </div>
      </div>
      <div className="flex h-full flex-col justify-between gap-4">
        <p className="text-foreground font-display text-[1.55rem] leading-none font-semibold tracking-[-0.05em] tabular-nums xl:text-[1.75rem]">
          {formatCurrency(value, currency)}
        </p>
        <p className="text-body-md text-muted-foreground">vs last month</p>
      </div>
    </article>
  );
}

export function DashboardKpiGrid({ summary }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <KpiCard
        changePercentage={summary.monthlyIncome.changePercentage}
        currency={summary.monthlyIncome.currency}
        label="Monthly income"
        value={summary.monthlyIncome.amount}
      />
      <KpiCard
        changePercentage={summary.monthlyExpenses.changePercentage}
        currency={summary.monthlyExpenses.currency}
        label="Monthly expenses"
        value={summary.monthlyExpenses.amount}
      />
      <KpiCard
        changePercentage={summary.netCashFlow.changePercentage}
        currency={summary.netCashFlow.currency}
        label="Net cash flow"
        value={summary.netCashFlow.amount}
      />
    </div>
  );
}
