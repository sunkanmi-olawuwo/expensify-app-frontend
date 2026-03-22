import { HomeScreen } from "@/features/home";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function PublicHomePage() {
  return <HomeScreen />;
}
