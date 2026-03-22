import { cn } from "@/lib/utils";

type AuthFeedbackBannerProps = {
  children: string;
  tone?: "error" | "info" | "success";
};

const toneClassNames: Record<NonNullable<AuthFeedbackBannerProps["tone"]>, string> =
  {
    error: "bg-destructive/10 text-destructive",
    info: "bg-surface-container-low text-muted-foreground",
    success: "bg-secondary/10 text-foreground",
  };

export function AuthFeedbackBanner({
  children,
  tone = "info",
}: AuthFeedbackBannerProps) {
  return (
    <div className={cn("rounded-2xl px-4 py-3", toneClassNames[tone])}>
      <p className="text-body-md">{children}</p>
    </div>
  );
}
