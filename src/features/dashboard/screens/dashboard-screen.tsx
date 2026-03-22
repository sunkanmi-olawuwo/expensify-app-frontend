import {
  PageHeader,
  MetricCard,
  PlaceholderChart,
  SurfaceCard,
} from "@/ui/composite";

import { DashboardHero } from "../components/dashboard-hero";
import { RecentLedger } from "../components/recent-ledger";
import { dashboardMetrics, quickActions } from "../types";

export function DashboardScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Bootstrap the dashboard around the hero, quick actions, and transaction hierarchy from the design references."
        eyebrow="Portfolio Overview"
        title="Available money should read like the opening page of a personal finance journal."
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
        <div className="space-y-8">
          <DashboardHero />

          <div className="grid gap-4 md:grid-cols-3">
            {dashboardMetrics.map((metric) => (
              <MetricCard
                key={metric.label}
                change={metric.change}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>

          <SurfaceCard
            description="A placeholder for the eventual dual-series income-versus-expense trend chart."
            eyebrow="Monthly Performance"
            title="Follow the month at a glance."
          >
            <PlaceholderChart label="Monthly performance chart placeholder" />
          </SurfaceCard>
        </div>

        <div className="space-y-8">
          <SurfaceCard
            description="Square-ish cards with room for icons and motion once the final action set exists."
            eyebrow="Money Tools"
            title="Quick action staging"
          >
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action}
                  className="bg-surface-container-low text-title-lg text-foreground shadow-ambient-sm flex min-h-28 items-end rounded-[calc(var(--radius-shell)-0.55rem)] p-4"
                >
                  {action}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <RecentLedger />
        </div>
      </div>
    </div>
  );
}
