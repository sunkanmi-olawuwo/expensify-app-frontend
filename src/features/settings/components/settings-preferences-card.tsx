import { Input } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import { defaultSettings } from "../types";

export function SettingsPreferencesCard() {
  return (
    <SurfaceCard
      description="Stub the eventual settings form with the fields called out in the PRD."
      eyebrow="User Preferences"
      title="Foundation preferences"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {defaultSettings.map((field) => (
          <label key={field.label} className="space-y-3">
            <span className="text-label-sm text-muted-foreground block">
              {field.label}
            </span>
            <Input
              className="bg-surface-container-low h-12 rounded-[1rem] border-transparent"
              defaultValue={field.value}
            />
            <span className="text-body-md text-muted-foreground block">
              {field.helper}
            </span>
          </label>
        ))}
      </div>
    </SurfaceCard>
  );
}
