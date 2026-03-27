import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { formatCurrency, formatSignedMetricChange } from "../utils";

import type { DashboardSummary } from "../types";

type DashboardHeroProps = {
  summary: DashboardSummary;
};

export function DashboardHero({ summary }: DashboardHeroProps) {
  const isPositive = summary.netCashFlow.changePercentage >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <SurfaceCard
      className="relative overflow-hidden"
      description="Net cash flow for the current month"
      eyebrow="Net Cash Flow"
      title={formatCurrency(
        summary.netCashFlow.amount,
        summary.netCashFlow.currency,
      )}
      tone="hero"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/12 blur-3xl"
      />
      <div className="relative z-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="space-y-5">
          <Badge className="w-fit bg-white/16 text-white hover:bg-white/16">
            <TrendIcon aria-hidden="true" className="size-3.5" />
            {formatSignedMetricChange(summary.netCashFlow)}
          </Badge>
          <p className="max-w-xl text-sm leading-6 text-white/80">
            Income remains ahead of expenses, keeping monthly cash flow positive.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[calc(var(--radius-shell)-0.55rem)] bg-white/10 p-4">
            <p className="text-label-sm text-white/72">Income</p>
            <p className="text-title-lg mt-3 text-white">
              {formatCurrency(
                summary.monthlyIncome.amount,
                summary.monthlyIncome.currency,
              )}
            </p>
          </div>
          <div className="rounded-[calc(var(--radius-shell)-0.55rem)] bg-white/10 p-4">
            <p className="text-label-sm text-white/72">Expenses</p>
            <p className="text-title-lg mt-3 text-white">
              {formatCurrency(
                summary.monthlyExpenses.amount,
                summary.monthlyExpenses.currency,
              )}
            </p>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
