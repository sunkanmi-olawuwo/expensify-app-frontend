import { LoginScreen } from "@/features/auth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return <LoginScreen />;
}
