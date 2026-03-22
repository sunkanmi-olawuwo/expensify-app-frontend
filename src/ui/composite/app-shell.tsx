
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="hidden w-[220px] shrink-0 lg:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)]">
            <AppSidebar className="h-full" />
          </div>
        </div>

        <div className="bg-editorial-grid shadow-ambient-md flex min-h-[calc(100vh-2rem)] flex-1 flex-col rounded-[calc(var(--radius-shell)+0.25rem)]">
          <TopBar />
          <main className="flex-1 px-4 pb-6 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
