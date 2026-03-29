import dynamic from "next/dynamic";

import type { Metadata } from "next";

const AdminUsersScreen = dynamic(() =>
  import("@/features/admin").then((module) => module.AdminUsersScreen),
);

export const metadata: Metadata = {
  title: "User Management",
};

export default function AdminUsersPage() {
  return <AdminUsersScreen />;
}
