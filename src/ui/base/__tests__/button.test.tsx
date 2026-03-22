import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/render";
import { Button } from "@/ui/base";

describe("Button", () => {
  it("renders through the app-owned base layer", () => {
    render(<Button>Save transaction</Button>);

    expect(
      screen.getByRole("button", { name: "Save transaction" }),
    ).toBeInTheDocument();
  });
});
