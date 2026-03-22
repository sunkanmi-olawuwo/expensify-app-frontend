import { cn } from "@/lib/utils";
import { SurfaceCard } from "@/ui/composite";

import { recentLedgerEntries } from "../types";

export function RecentLedger() {
  return (
    <SurfaceCard
      description="A divider-free list style aligned to the design document's spacing rules."
      eyebrow="Recent Ledger"
      title="Latest movements"
    >
      <div className="space-y-4">
        {recentLedgerEntries.map((entry) => (
          <div
            key={`${entry.merchant}-${entry.amount}`}
            className="bg-surface-container-low hover:bg-surface-container rounded-[calc(var(--radius-shell)-0.55rem)] p-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-title-lg text-foreground">
                  {entry.merchant}
                </p>
                <p className="text-body-md text-muted-foreground">
                  {entry.category}
                </p>
                <p className="text-label-sm text-muted-foreground">
                  {entry.timeAgo}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-title-lg",
                    entry.tone === "income"
                      ? "text-secondary"
                      : "text-destructive",
                  )}
                >
                  {entry.amount}
                </p>
                <p className="text-label-sm text-muted-foreground">
                  {entry.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
