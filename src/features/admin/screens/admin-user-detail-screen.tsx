import { PageHeader } from "@/ui/composite";

import { AdminPlaceholder } from "../components/admin-placeholder";
import { AdminSubNav } from "../components/admin-sub-nav";

export function AdminUserDetailScreen({ userId: _userId }: { userId: string }) {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="The admin drill-down surface is reserved for cross-user financial review once expense and income endpoints are connected."
        eyebrow="Administration"
        title="User Detail"
      />

      <AdminSubNav />

      <AdminPlaceholder message="User detail is under construction. This placeholder confirms the nested admin route and shared sub-navigation are wired correctly." />
    </div>
  );
}
