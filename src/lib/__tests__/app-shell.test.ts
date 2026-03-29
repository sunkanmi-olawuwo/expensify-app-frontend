import { describe, expect, it } from "vitest";

import { getPageChrome } from "../app-shell";

describe("getPageChrome", () => {
  it("returns user detail chrome for nested admin user paths", () => {
    expect(getPageChrome("/admin/users/user-123")).toEqual({
      description:
        "Inspect an individual workspace once the admin drill-down for expenses, income, and summaries is connected.",
      eyebrow: "Administration",
      searchPlaceholder: "Search user records...",
      title: "User Detail",
    });
  });
});
