"use client";

import { Bell, CircleHelp, Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";


import { getPageChrome } from "@/lib/app-shell";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  Button,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ui/base";

import { AppSidebar } from "./app-sidebar";

const iconButtonClassName =
  "relative size-11 rounded-full bg-surface text-foreground shadow-ambient-sm hover:bg-surface-container-low";

export function TopBar() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pageChrome = getPageChrome(pathname);

  return (
    <header className="bg-background/80 sticky top-0 z-30 px-4 pt-4 pb-4 backdrop-blur-xl sm:px-8">
      <div className="shadow-ambient-sm rounded-full bg-white/70 px-3 py-3 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex items-start gap-3 lg:min-w-[12rem] lg:flex-1 lg:items-center">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    aria-label="Open navigation"
                    className={iconButtonClassName}
                    size="icon-lg"
                    variant="ghost"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="bg-surface-container-low w-[22rem] max-w-[90vw] border-none p-3"
                  showCloseButton={false}
                  side="left"
                >
                  <SheetHeader className="px-0 pt-0 pb-3">
                    <SheetTitle className="text-title-lg">
                      Workspace navigation
                    </SheetTitle>
                  </SheetHeader>
                  <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-label-sm text-muted-foreground">
                {pageChrome.eyebrow}
              </p>
              <p className="text-title-lg text-foreground mt-1 text-balance">
                {pageChrome.title}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto lg:flex-1 lg:justify-end">
            <div className="relative w-full min-w-0 sm:flex-1 lg:max-w-md">
              <Input
                aria-label="Search workspace"
                className="bg-surface-container-low focus-visible:border-primary/20 focus-visible:ring-primary/10 h-12 rounded-full border-transparent pr-5 pl-5 shadow-none focus-visible:ring-4"
                placeholder={pageChrome.searchPlaceholder}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Open notifications"
                  className={iconButtonClassName}
                  size="icon-lg"
                  variant="ghost"
                >
                  <Bell className="size-5" />
                  <span className="bg-secondary absolute top-3 right-3 size-2 rounded-full" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Open help"
                  className={iconButtonClassName}
                  size="icon-lg"
                  variant="ghost"
                >
                  <CircleHelp className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help</TooltipContent>
            </Tooltip>

            <Button className="h-12 rounded-full px-5">
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add New</span>
            </Button>

            <Avatar
              className={cn(
                iconButtonClassName,
                "bg-primary text-primary-foreground overflow-hidden",
              )}
            >
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                FA
              </AvatarFallback>
            </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
