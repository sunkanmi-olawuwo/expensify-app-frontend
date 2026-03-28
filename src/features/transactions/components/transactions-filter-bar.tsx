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
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {transactionFilters.map((filter) => (
          <div
            key={filter.label}
            className="bg-surface shadow-ambient-sm min-w-0 rounded-full px-4 py-3 sm:min-w-44"
          >
            <p className="text-label-sm text-muted-foreground">
              {filter.label}
            </p>
            <p className="text-body-md text-foreground mt-1">{filter.value}</p>
          </div>
        ))}
        <Button
          className="w-full rounded-full sm:ml-auto sm:w-auto"
          variant="ghost"
        >
          Clear all filters
        </Button>
      </div>
    </SurfaceCard>
  );
}
