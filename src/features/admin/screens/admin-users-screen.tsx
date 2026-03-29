import { PageHeader } from "@/ui/composite";

import { AdminPlaceholder } from "../components/admin-placeholder";
import { AdminSubNav } from "../components/admin-sub-nav";

export function AdminUsersScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="This workspace is wired for admin-only access and ready for the user directory, filters, and moderation actions to land next."
        eyebrow="Administration"
        title="User Management"
      />

      <AdminSubNav />

      <AdminPlaceholder message="User directory tooling is under construction. The route, guard, and workspace navigation are ready for the next phase." />
    </div>
  );
}
