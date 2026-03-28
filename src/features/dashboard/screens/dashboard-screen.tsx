"use client";

import { PageHeader } from "@/ui/composite";

import { DashboardHero } from "../components/dashboard-hero";
import { DashboardKpiGrid } from "../components/dashboard-kpi-grid";
import { MonthlyPerformanceChart } from "../components/monthly-performance-chart";
import { RecentTransactions } from "../components/recent-transactions";
import { SpendingBreakdown } from "../components/spending-breakdown";
import { useDashboardSummary } from "../hooks/use-dashboard-summary";

export function DashboardScreen() {
  const { data: summary, isError, isLoading } = useDashboardSummary();

  if (isError) {
    return (
      <div className="py-4" role="alert">
        <p className="text-body-md text-destructive">
          Unable to load dashboard data. Please refresh the page.
        </p>
      </div>
    );
  }

  if (isLoading || !summary) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading dashboard"
        className="py-4"
        role="status"
      >
        <span className="sr-only">Loading financial overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 sm:py-6">
      <PageHeader eyebrow="Dashboard" title="Financial overview" />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_22rem]">
        <div className="space-y-6">
          <DashboardHero summary={summary} />

          <DashboardKpiGrid summary={summary} />

          <MonthlyPerformanceChart summary={summary} />
        </div>

        <div className="space-y-6">
          <SpendingBreakdown summary={summary} />
          <RecentTransactions summary={summary} />
        </div>
      </div>
    </div>
  );
}
