import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";

import { PublicFooter } from "../public-footer";

describe("PublicFooter", () => {
  it("renders only the copyright content for phase 2", () => {
    render(<PublicFooter />);

    expect(screen.getByText("© 2026 expensify")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
