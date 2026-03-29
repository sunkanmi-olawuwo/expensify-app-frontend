import dynamic from "next/dynamic";

import type { Metadata } from "next";

const AdminCatalogsScreen = dynamic(() =>
  import("@/features/admin").then((module) => module.AdminCatalogsScreen),
);

export const metadata: Metadata = {
  title: "System Catalogs",
};

export default function AdminCatalogsPage() {
  return <AdminCatalogsScreen />;
}
