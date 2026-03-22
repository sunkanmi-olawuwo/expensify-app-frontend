import { cn } from "@/lib/utils";

type PlaceholderChartProps = {
  className?: string;
  label: string;
  tone?: "area" | "bars";
};

export function PlaceholderChart({
  className,
  label,
  tone = "area",
}: PlaceholderChartProps) {
  return (
    <div
      aria-label={label}
      className={cn(
        "bg-surface-bright overflow-hidden rounded-[calc(var(--radius-shell)-0.45rem)] p-4",
        className,
      )}
      role="img"
    >
      {tone === "area" ? (
        <div className="flex h-44 items-end gap-2">
          {[28, 52, 36, 80, 66, 92, 70].map((height, index) => (
            <div
              key={`${label}-${height}-${index}`}
              className="flex-1 rounded-full bg-[linear-gradient(180deg,var(--primary-fixed),rgba(107,126,194,0.14))]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-44 items-end gap-3">
          {[44, 28, 62, 38, 76, 54].map((height, index) => (
            <div
              key={`${label}-${height}-${index}`}
              className="flex-1 rounded-t-[1rem] bg-[linear-gradient(180deg,var(--primary),var(--primary-container))]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
      <p className="text-label-sm text-muted-foreground mt-3">{label}</p>
    </div>
  );
}
