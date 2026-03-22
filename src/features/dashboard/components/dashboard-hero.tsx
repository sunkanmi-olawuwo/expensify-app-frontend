import { Badge } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

export function DashboardHero() {
  return (
    <SurfaceCard
      className="overflow-hidden"
      description="Use this hero treatment as the blueprint for the available-capital panel in the final product build."
      eyebrow="Available Capital"
      title="$142,850.00"
      tone="hero"
    >
      <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end">
        <Badge className="w-fit bg-white/16 text-white hover:bg-white/16">
          +12.4% this month
        </Badge>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[calc(var(--radius-shell)-0.55rem)] bg-white/10 p-4">
            <p className="text-label-sm text-white/72">Monthly income</p>
            <p className="text-title-lg mt-3 text-white">$18,450.00</p>
          </div>
          <div className="rounded-[calc(var(--radius-shell)-0.55rem)] bg-white/10 p-4">
            <p className="text-label-sm text-white/72">Monthly expenses</p>
            <p className="text-title-lg mt-3 text-white">$9,284.00</p>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
