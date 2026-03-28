import { ArrowRight, Landmark, Sparkles, WalletCards } from "lucide-react";
import Link from "next/link";

import { publicRoutes } from "@/features/auth/types";
import { Button } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { HomeVisualStrip } from "../components/home-visual-strip";
import { ValuePropositionCard } from "../components/value-proposition-card";

const valueProps = [
  {
    description:
      "Give income, spending, and recurring bills one editorial timeline instead of scattered widgets.",
    icon: WalletCards,
    title: "Track the month with narrative clarity.",
  },
  {
    description:
      "Stage the next generation of analytics and AI guidance inside a shell that already feels premium.",
    icon: Sparkles,
    title: "Keep insights ready for the data layer.",
  },
  {
    description:
      "Move from dashboard noise to deliberate review states for capital, risk, and recurring obligations.",
    icon: Landmark,
    title: "Treat money like a considered operating system.",
  },
];

export function HomeScreen() {
  return (
    <div className="space-y-20 py-4 sm:py-6">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-start">
            <span className="text-label-sm text-muted-foreground lg:order-2 lg:justify-self-end lg:pt-4">
              Personal Finance Workspace
            </span>
            <div className="space-y-6">
              <h1 className="text-display-lg text-foreground max-w-4xl">
                A monthly money story with enough room to think.
              </h1>
              <p className="text-body-md text-muted-foreground max-w-2xl text-base">
                <b>Expensify</b> frames personal finance as a calm, high-signal
                workspace. Review the transactions, shape decisions, and prepare
                for deeper analytics without the noise of a legacy banking
                portal.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild className="h-12 rounded-full px-6 text-sm">
              <Link href={publicRoutes.signup}>
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-surface-container-high text-foreground hover:bg-surface-container h-12 rounded-full px-6"
              variant="ghost"
            >
              <Link href={publicRoutes.login}>Log In</Link>
            </Button>
          </div>
        </div>

        <SurfaceCard
          className="bg-popover"
          description="See how the product frames your money before you ever sign in: current cash position, recurring commitments, and the habits that shape the month."
          eyebrow="Financial Snapshot"
          title="Start with the signals that matter most."
        >
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4">
              <p className="text-label-sm text-muted-foreground">
                Available Cash
              </p>
              <p className="text-title-lg text-foreground mt-3">
                Know what is truly free to spend.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4">
              <p className="text-label-sm text-muted-foreground">
                Recurring Bills
              </p>
              <p className="text-title-lg text-foreground mt-3">
                Keep subscriptions and fixed costs visible.
              </p>
            </div>
            <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.55rem)] p-4">
              <p className="text-label-sm text-muted-foreground">
                Spending Patterns
              </p>
              <p className="text-title-lg text-foreground mt-3">
                Spot drift before it becomes overspend.
              </p>
            </div>
          </div>
        </SurfaceCard>
      </section>

      <section className="space-y-8">
        <HomeVisualStrip />

        <div className="grid gap-6 lg:grid-cols-3">
          {valueProps.map((item) => (
            <ValuePropositionCard
              key={item.title}
              description={item.description}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
