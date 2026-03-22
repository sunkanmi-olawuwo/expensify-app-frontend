import { cn } from "@/lib/utils";

type MetricCardProps = {
  change: string;
  className?: string;
  label: string;
  value: string;
};

export function MetricCard({
  change,
  className,
  label,
  value,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-low shadow-ambient-sm rounded-[calc(var(--radius-shell)-0.35rem)] p-5",
        className,
      )}
    >
      <p className="text-label-sm text-muted-foreground">{label}</p>
      <p className="text-title-lg text-foreground mt-4">{value}</p>
      <p className="text-body-md text-muted-foreground mt-2">{change}</p>
    </div>
  );
}
