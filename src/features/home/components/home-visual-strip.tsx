import { ArrowUpRight, Landmark, WalletCards } from "lucide-react";

export function HomeVisualStrip() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
      <article className="shadow-ambient-md relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-shell)+0.25rem)] bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] p-8 text-white">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/8 blur-2xl" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-end">
          <div className="space-y-4">
            <p className="text-label-sm text-white/72">Monthly Rhythm</p>
            <h2 className="font-display max-w-xl text-[2.4rem] leading-[0.95] font-semibold tracking-[-0.06em] text-balance">
              A calmer way to see cash, commitments, and momentum.
            </h2>
            <p className="text-body-md max-w-lg text-white/80">
              Designed to turn personal finance into a readable surface instead
              of a wall of widgets.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-[calc(var(--radius-shell)-0.45rem)] bg-white/12 p-4 backdrop-blur-sm">
              <p className="text-label-sm text-white/68">Available to Spend</p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                $4,820
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/80">
                <ArrowUpRight className="size-4" />
                12% ahead of last month
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 grid gap-4 lg:mt-auto lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[calc(var(--radius-shell)-0.45rem)] bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-label-sm text-white/68">This Month</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Saved
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  $1,240
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                  Bills Left
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  3
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[calc(var(--radius-shell)-0.45rem)] bg-white/6 p-5 backdrop-blur-sm">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-label-sm text-white/68">Weekly Flow</p>
                <p className="mt-2 text-body-md max-w-xs text-white/78">
                  Income remains ahead of core spending as the month closes.
                </p>
              </div>
              <p className="text-sm text-white/70">4 weeks</p>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <div className="space-y-2">
                <div className="flex items-end gap-1.5">
                  <div
                    className="w-3 rounded-full bg-white/22"
                    style={{ height: 42 }}
                  />
                  <div
                    className="w-3 rounded-full bg-secondary/75"
                    style={{ height: 74 }}
                  />
                </div>
                <p className="text-xs text-white/55">W1</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-1.5">
                  <div
                    className="w-3 rounded-full bg-white/22"
                    style={{ height: 54 }}
                  />
                  <div
                    className="w-3 rounded-full bg-secondary/75"
                    style={{ height: 88 }}
                  />
                </div>
                <p className="text-xs text-white/55">W2</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-1.5">
                  <div
                    className="w-3 rounded-full bg-white/22"
                    style={{ height: 62 }}
                  />
                  <div
                    className="w-3 rounded-full bg-secondary/75"
                    style={{ height: 104 }}
                  />
                </div>
                <p className="text-xs text-white/55">W3</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-1.5">
                  <div
                    className="w-3 rounded-full bg-white/22"
                    style={{ height: 48 }}
                  />
                  <div
                    className="w-3 rounded-full bg-secondary/75"
                    style={{ height: 94 }}
                  />
                </div>
                <p className="text-xs text-white/55">W4</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        <article className="bg-surface shadow-ambient-sm relative overflow-hidden rounded-[var(--radius-shell)] p-6">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[rgb(107_126_194_/_0.14)] blur-2xl" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-muted-foreground">
                Bill Stack
              </span>
              <Landmark className="text-primary size-5" />
            </div>

            <div className="space-y-3">
              <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-body-md text-foreground font-medium">
                    Rent
                  </p>
                  <p className="text-body-md text-muted-foreground">$1,640</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgb(27_43_91_/_0.12)]">
                  <div className="h-2 w-3/4 rounded-full bg-[linear-gradient(90deg,var(--primary-fixed),var(--primary))]" />
                </div>
              </div>

              <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-body-md text-foreground font-medium">
                    Subscriptions
                  </p>
                  <p className="text-body-md text-muted-foreground">$142</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-[rgb(27_43_91_/_0.12)]">
                  <div className="h-2 w-1/3 rounded-full bg-[linear-gradient(90deg,var(--primary-fixed),var(--primary))]" />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="bg-surface-container-low shadow-ambient-sm relative overflow-hidden rounded-[var(--radius-shell)] p-6">
          <div className="absolute right-6 bottom-6 h-24 w-24 rounded-full border-[10px] border-[rgb(45_106_79_/_0.16)] border-t-secondary border-r-secondary/50" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-muted-foreground">
                Spending Drift
              </span>
              <WalletCards className="text-primary size-5" />
            </div>

            <div className="flex items-end gap-3">
              <div className="bg-primary/18 w-8 rounded-full" style={{ height: 56 }} />
              <div className="bg-primary/32 w-8 rounded-full" style={{ height: 84 }} />
              <div className="bg-primary/46 w-8 rounded-full" style={{ height: 112 }} />
              <div
                className="w-8 rounded-full bg-[linear-gradient(180deg,var(--primary-fixed),var(--primary))]"
                style={{ height: 148 }}
              />
            </div>

            <p className="text-title-lg text-foreground max-w-xs">
              Review category growth before small changes turn into budget drag.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
