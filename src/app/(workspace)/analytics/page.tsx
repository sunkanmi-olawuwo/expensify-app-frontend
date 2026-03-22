import { AnalyticsScreen } from "@/features/analytics";

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPage() {
  return <AnalyticsScreen />;
}
