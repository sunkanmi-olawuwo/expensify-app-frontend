import { PlaceholderChart, SurfaceCard } from "@/ui/composite";

import { spendingBreakdown } from "../types";

export function AnalyticsOverview() {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)]">
      <SurfaceCard
        description="Reserve this region for the primary trend visualization and time segmentation controls."
        eyebrow="Spending Velocity"
        title="A chart-first narrative."
      >
        <PlaceholderChart label="Analytics area chart placeholder" />
      </SurfaceCard>

      <SurfaceCard
        description="Category breakdown should sit beside the hero chart as a compact supporting panel."
        eyebrow="Breakdown"
        title="Spending composition"
      >
        <div className="space-y-4">
          {spendingBreakdown.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="text-body-md flex items-center justify-between">
                <span className="text-foreground font-semibold">
                  {category.name}
                </span>
                <span className="text-muted-foreground">{category.share}</span>
              </div>
              <div className="bg-surface-container-highest h-2 rounded-full">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary-fixed),var(--primary))]"
                  style={{ width: category.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
