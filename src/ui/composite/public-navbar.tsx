"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { publicRoutes } from "@/features/auth/types";
import { Button, Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/ui/base";

const publicLinks = [
  { href: publicRoutes.home, label: "Home" },
  { href: publicRoutes.login, label: "Log In" },
  { href: publicRoutes.signup, label: "Get Started" },
] as const;

export function PublicNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="relative z-10 px-4 pt-6 sm:px-8 sm:pt-8">
      <div className="bg-surface/80 shadow-ambient-sm flex h-16 items-center justify-between rounded-full px-4 backdrop-blur-xl sm:px-6">
        <Link
          className="font-display text-foreground text-xl font-semibold tracking-[-0.06em]"
          href={publicRoutes.home}
        >
          expensify
        </Link>

        <nav
          aria-label="Public primary navigation"
          className="hidden items-center gap-3 sm:flex"
        >
          <Button asChild className="h-11 rounded-full px-5" variant="ghost">
            <Link href={publicRoutes.login}>Log In</Link>
          </Button>
          <Button asChild className="h-11 rounded-full px-5">
            <Link href={publicRoutes.signup}>Get Started</Link>
          </Button>
        </nav>

        <div className="sm:hidden">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label="Open public navigation"
                className="bg-surface text-foreground shadow-ambient-sm size-11 rounded-full hover:bg-surface-container-low"
                size="icon-lg"
                variant="ghost"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="bg-surface/70 flex w-[20rem] flex-col gap-8 border-none p-6 backdrop-blur-[20px]"
              showCloseButton={false}
              side="left"
            >
              <SheetTitle className="font-display text-xl tracking-[-0.06em]">
                expensify
              </SheetTitle>
              <nav aria-label="Public navigation menu" className="space-y-3">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    className="bg-surface-container-low text-foreground flex min-h-12 items-center rounded-full px-4"
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
