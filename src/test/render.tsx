
import {
  render as testingLibraryRender,
  type RenderOptions,
} from "@testing-library/react";
import { useState } from "react";

import { createQueryClient, QueryClientProvider } from "@/lib/api";
import { AuthProvider } from "@/lib/auth";
import { TooltipProvider } from "@/ui/base";
import { ToastProvider } from "@/ui/composite";

import type { ReactElement, ReactNode } from "react";

function TestProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <TooltipProvider>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return testingLibraryRender(ui, {
    wrapper: TestProviders,
    ...options,
  });
}

export * from "@testing-library/react";
export { render };
