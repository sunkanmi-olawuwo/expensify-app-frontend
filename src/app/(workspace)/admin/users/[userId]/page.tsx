import dynamic from "next/dynamic";

import type { Metadata } from "next";

const AdminUserDetailScreen = dynamic(() =>
  import("@/features/admin").then((module) => module.AdminUserDetailScreen),
);

export const metadata: Metadata = {
  title: "User Detail",
};

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { userId } = await params;
  return <AdminUserDetailScreen userId={userId} />;
}
