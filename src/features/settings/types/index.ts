export type SettingField = {
  helper: string;
  label: string;
  value: string;
};

export const defaultSettings: SettingField[] = [
  {
    helper:
      "Used for dashboard math, transaction formatting, and AI grounding.",
    label: "Currency",
    value: "USD",
  },
  {
    helper: "Controls month boundaries and date-sensitive comparisons.",
    label: "Timezone",
    value: "Europe/London",
  },
  {
    helper: "Future monthly rollups will anchor to this day.",
    label: "Month start day",
    value: "1",
  },
];
