import { PageHeader, PlaceholderChart, SurfaceCard } from "@/ui/composite";

import { AnalyticsOverview } from "../components/analytics-overview";

export function AnalyticsScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Use the analytics sample as the inspiration for a primary-chart-first layout with a supporting breakdown rail."
        eyebrow="Visual Analytics"
        title="Trends, category drift, and anomalies should read as one composed story."
      />

      <AnalyticsOverview />

      <div className="grid gap-8 lg:grid-cols-2">
        <SurfaceCard
          description="A second chart region reserved for daily velocity and sustainable spending messaging."
          eyebrow="Daily Spending Velocity"
          title="Secondary movement"
        >
          <PlaceholderChart
            label="Daily spending bars placeholder"
            tone="bars"
          />
        </SurfaceCard>

        <SurfaceCard
          description="Hold room for alerts and recommendations without turning the page into a dashboard grid of boxes."
          eyebrow="Insight Cards"
          title="Budget and sustainability placeholders"
        >
          <div className="grid gap-4">
            <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-5">
              <p className="text-title-lg text-foreground">Budget alert</p>
              <p className="text-body-md text-muted-foreground mt-2">
                Keep this block ready for future alert logic once budgets enter
                scope.
              </p>
            </div>
            <div className="rounded-[calc(var(--radius-shell)-0.55rem)] bg-[rgb(45_106_79_/_0.08)] p-5">
              <p className="text-title-lg text-foreground">
                Sustainable spending
              </p>
              <p className="text-body-md text-muted-foreground mt-2">
                Reserve this calmer treatment for low-friction recommendations
                and trend nudges.
              </p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
