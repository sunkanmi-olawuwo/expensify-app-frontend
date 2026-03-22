import { AuthGuard } from "@/lib/auth";
import { AppShell } from "@/ui/composite";

import type { ReactNode } from "react";


export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
