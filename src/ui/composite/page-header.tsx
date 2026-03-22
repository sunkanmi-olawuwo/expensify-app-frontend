import { cn } from "@/lib/utils";

type PageHeaderProps = {
  className?: string;
  description: string;
  eyebrow: string;
  title: string;
};

export function PageHeader({
  className,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <span className="text-label-sm text-muted-foreground">{eyebrow}</span>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <h1 className="text-headline-md text-foreground max-w-3xl sm:text-[2.4rem]">
          {title}
        </h1>
        <p className="text-body-md text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
