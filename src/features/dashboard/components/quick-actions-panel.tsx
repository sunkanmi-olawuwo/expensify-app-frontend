"use client";

import { useState } from "react";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { dashboardQuickActions } from "../utils";

export function QuickActionsPanel() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const activeAction =
    dashboardQuickActions.find((action) => action.label === activeLabel) ?? null;

  return (
    <Sheet
      open={activeAction !== null}
      onOpenChange={(open) => {
        if (!open) {
          setActiveLabel(null);
        }
      }}
    >
      <SurfaceCard
        description="Shortcuts for common actions"
        eyebrow="Money Tools"
        title="Quick actions"
      >
        <div className="grid grid-cols-2 gap-4">
          {dashboardQuickActions.map((action) => (
            <button
              key={action.label}
              className="bg-surface-container-low text-left text-foreground shadow-ambient-sm hover:bg-surface-container flex min-h-28 flex-col justify-between rounded-[calc(var(--radius-shell)-0.55rem)] p-4 transition-colors"
              onClick={() => setActiveLabel(action.label)}
              type="button"
            >
              <span className="bg-primary/10 text-primary inline-flex size-11 items-center justify-center rounded-full">
                <action.icon className="size-4" />
              </span>
              <div className="space-y-1">
                <span className="text-body-md block font-semibold">
                  {action.label}
                </span>
                <span className="text-body-md text-muted-foreground block">
                  {action.detail}
                </span>
              </div>
            </button>
          ))}
        </div>
      </SurfaceCard>

      <SheetContent className="bg-surface p-0" side="right">
        {activeAction ? (
          <>
            <SheetHeader className="border-b border-border px-6 py-6">
              <SheetTitle className="text-headline-md">
                {activeAction.label}
              </SheetTitle>
              <SheetDescription className="mt-2 max-w-xs text-sm leading-6">
                {activeAction.description}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col justify-between px-6 py-6">
              <div className="space-y-4">
                <div className="bg-surface-container-low rounded-[calc(var(--radius-shell)-0.45rem)] p-5">
                  <p className="text-title-lg text-foreground">
                    Coming soon
                  </p>
                  <p className="text-body-md text-muted-foreground mt-2">
                    This action is part of the planned product surface but is
                    not available in the current release.
                  </p>
                </div>
                <p className="text-body-md text-muted-foreground">
                  The dashboard keeps the entry point visible so the final flow
                  can be added without redesigning the page.
                </p>
              </div>
              <SheetClose asChild>
                <Button className="mt-6 w-full">Close</Button>
              </SheetClose>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
