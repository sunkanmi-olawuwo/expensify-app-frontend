import { Button } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { transactionFilters } from "../types";

export function TransactionsFilterBar() {
  return (
    <SurfaceCard
      className="bg-surface-container-low"
      description="Treat these as tonal filter chips, not bordered controls."
      eyebrow="Filters"
      title="History controls"
      tone="subtle"
    >
      <div className="flex flex-wrap items-center gap-3">
        {transactionFilters.map((filter) => (
          <div
            key={filter.label}
            className="shadow-ambient-sm min-w-44 rounded-full bg-white px-4 py-3"
          >
            <p className="text-label-sm text-muted-foreground">
              {filter.label}
            </p>
            <p className="text-body-md text-foreground mt-1">{filter.value}</p>
          </div>
        ))}
        <Button className="ml-auto rounded-full" variant="ghost">
          Clear all filters
        </Button>
      </div>
    </SurfaceCard>
  );
}
