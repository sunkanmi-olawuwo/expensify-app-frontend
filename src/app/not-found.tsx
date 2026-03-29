import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/ui/base";

export default function NotFound() {
  return (
    <main className="px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1080px] flex-col rounded-[calc(var(--radius-shell)+0.5rem)] bg-surface shadow-[0_24px_48px_rgb(26_35_64_/_0.05)]">
        <header className="flex items-center justify-between px-6 pt-5 sm:px-8 sm:pt-6">
          <div className="space-y-1">
            <p className="font-display text-foreground text-2xl font-semibold tracking-[-0.06em]">
              expensify
            </p>
            <p className="text-label-sm text-muted-foreground">
              Not found
            </p>
          </div>

          <Button
            asChild
            className="bg-surface-container-low text-foreground hover:bg-surface-container rounded-full px-5"
            variant="ghost"
          >
            <Link href="/">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back home
            </Link>
          </Button>
        </header>

        <div className="flex flex-1 items-start px-6 pt-4 pb-6 sm:px-8 sm:pt-5 sm:pb-8">
          <section className="mx-auto w-full max-w-[36rem] rounded-[calc(var(--radius-shell)-0.1rem)] bg-surface-container-low px-6 py-6 shadow-[inset_0_0_0_1px_rgb(196_200_212_/_0.14)] sm:px-8 sm:py-8">
            <div className="space-y-5">
              <span className="bg-surface text-muted-foreground inline-flex rounded-full px-4 py-2 text-label-sm shadow-[inset_0_0_0_1px_rgb(196_200_212_/_0.16)]">
                Error 404
              </span>
              <p aria-hidden="true" className="font-display text-foreground text-[clamp(4rem,10vw,6rem)] font-semibold leading-[0.9] tracking-[-0.08em]">
                404
              </p>
              <div className="space-y-3">
                <h1 className="text-headline-md text-foreground">Page not found</h1>
                <p className="text-body-md text-muted-foreground max-w-xl text-base">
                  The page you requested could not be found. The link may be
                  outdated, the route may have changed, or the address may be
                  incorrect.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-full px-6">
                <Link href="/dashboard">
                  <LayoutDashboard aria-hidden="true" className="size-4" />
                  Go to dashboard
                </Link>
              </Button>
              <Button
                asChild
                className="bg-surface text-foreground hover:bg-surface-container h-12 rounded-full px-6 shadow-[inset_0_0_0_1px_rgb(196_200_212_/_0.16)]"
                variant="ghost"
              >
                <Link href="/">
                  <Home aria-hidden="true" className="size-4" />
                  Start from home
                </Link>
              </Button>
            </div>

            <p className="text-body-md text-muted-foreground mt-6">
              Check the URL or return to a known page to continue.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
