import { LoginScreen } from "@/features/auth";
import { asPublicAuthStatus } from "@/features/auth/types";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};

type LoginPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <LoginScreen status={asPublicAuthStatus(resolvedSearchParams?.status)} />
  );
}
