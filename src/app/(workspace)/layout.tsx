import { AppShell } from "@/ui/composite";

import type { ReactNode } from "react";


export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
