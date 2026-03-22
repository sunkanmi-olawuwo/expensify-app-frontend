import { ResetPasswordScreen } from "@/features/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <ResetPasswordScreen
      email={resolvedSearchParams?.email ?? null}
      token={resolvedSearchParams?.token ?? null}
    />
  );
}
