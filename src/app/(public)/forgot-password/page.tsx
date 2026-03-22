import { ForgotPasswordScreen } from "@/features/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordScreen />;
}
