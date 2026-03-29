import { PageHeader } from "@/ui/composite";

import { AdminPlaceholder } from "../components/admin-placeholder";
import { AdminSubNav } from "../components/admin-sub-nav";

export function AdminCatalogsScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Shared preference catalogs will land here once the admin CRUD flows for currencies and timezones are connected."
        eyebrow="Administration"
        title="System Catalogs"
      />

      <AdminSubNav />

      <AdminPlaceholder message="System catalogs are under construction. This screen is the foundation for currency and timezone administration." />
    </div>
  );
}
