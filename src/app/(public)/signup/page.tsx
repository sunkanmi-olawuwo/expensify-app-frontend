import { SignupScreen } from "@/features/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return <SignupScreen />;
}
