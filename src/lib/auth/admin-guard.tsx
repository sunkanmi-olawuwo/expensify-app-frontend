"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "./auth-context";

import type { ReactNode } from "react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "Admin") {
      router.replace("/dashboard");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div role="status">
        <span className="sr-only">Verifying access, please wait…</span>
      </div>
    );
  }

  if (user.role !== "Admin") {
    return (
      <div role="alert">
        <span className="sr-only">
          You do not have permission to view this page. Redirecting…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
