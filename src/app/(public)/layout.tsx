import { PublicFooter, PublicNavbar } from "@/ui/composite";

import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="bg-editorial-grid shadow-ambient-md flex min-h-[calc(100vh-2rem)] flex-1 flex-col rounded-[calc(var(--radius-shell)+0.25rem)]">
          <PublicNavbar />
          <main className="flex-1 px-4 py-8 sm:px-8 sm:py-10">{children}</main>
          <PublicFooter />
        </div>
      </div>
    </div>
  );
}
