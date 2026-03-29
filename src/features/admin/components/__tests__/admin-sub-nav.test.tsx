import { describe, expect, it } from "vitest";

import { setMockPathname } from "@/test/next-navigation";
import { render, screen } from "@/test/render";

import { AdminSubNav } from "../admin-sub-nav";

describe("AdminSubNav", () => {
  it("highlights users on the users route", () => {
    setMockPathname("/admin/users");

    render(<AdminSubNav />);

    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Catalogs" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps users active on nested user detail routes", () => {
    setMockPathname("/admin/users/user-123");

    render(<AdminSubNav />);

    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("highlights catalogs on the catalogs route", () => {
    setMockPathname("/admin/catalogs");

    render(<AdminSubNav />);

    expect(screen.getByRole("link", { name: "Catalogs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Users" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
