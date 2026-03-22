import { Button } from "@/ui/base";
import { PageHeader, SurfaceCard } from "@/ui/composite";

import { SettingsPreferencesCard } from "../components/settings-preferences-card";

export function SettingsScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Keep this route intentionally sparse so real preference flows can land without being boxed into a starter dashboard aesthetic."
        eyebrow="Preferences"
        title="Settings should read as quiet infrastructure, not another feature grid."
      />

      <SettingsPreferencesCard />

      <SurfaceCard
        description="Reserve room for auth and security controls once backend integration starts."
        eyebrow="Security"
        title="Session and access placeholders"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button>Review sessions</Button>
          <Button variant="ghost">Rotate credentials</Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
