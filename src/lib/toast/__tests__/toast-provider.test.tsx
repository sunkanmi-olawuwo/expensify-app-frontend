import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { toast } from "@/lib/toast";
import { act, fireEvent, render, screen, within } from "@/test/render";

function getPoliteRegion() {
  const viewport = screen.getByLabelText("Notifications");
  const regions = viewport.querySelectorAll("[aria-live]");

  for (const region of regions) {
    if (region.getAttribute("aria-live") === "polite") {
      return region as HTMLElement;
    }
  }

  throw new Error("Polite live region not found");
}

function getAssertiveRegion() {
  const viewport = screen.getByLabelText("Notifications");
  const regions = viewport.querySelectorAll("[aria-live]");

  for (const region of regions) {
    if (region.getAttribute("aria-live") === "assertive") {
      return region as HTMLElement;
    }
  }

  throw new Error("Assertive live region not found");
}

describe("ToastProvider", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders responsive viewport metadata and variant live-region semantics", async () => {
    render(<div>toast host</div>);

    act(() => {
      toast.success("Saved successfully.");
      toast.error("Unable to save.");
    });

    const viewport = screen.getByLabelText("Notifications");

    expect(viewport).toHaveAttribute("data-mobile-position", "top");
    expect(viewport).toHaveAttribute("data-desktop-position", "bottom-right");

    const politeRegion = getPoliteRegion();
    const assertiveRegion = getAssertiveRegion();

    expect(within(politeRegion).getByText("Saved successfully.")).toBeInTheDocument();
    expect(within(assertiveRegion).getByText("Unable to save.")).toBeInTheDocument();
  });

  it("auto-dismisses non-error toasts after the default duration", () => {
    vi.useFakeTimers();

    render(<div>toast host</div>);

    act(() => {
      toast.success("Auto dismiss");
    });

    expect(screen.getByText("Auto dismiss")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    expect(screen.getByText("Auto dismiss").closest("[data-state]")).toHaveAttribute(
      "data-state",
      "closed",
    );

    act(() => {
      vi.advanceTimersByTime(180);
    });
    expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
  });

  it("keeps error toasts open until they are dismissed", () => {
    vi.useFakeTimers();

    render(<div>toast host</div>);

    act(() => {
      toast.error("Persistent error");
    });

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    const errorToast = screen.getByText("Persistent error").closest("[data-state]");
    expect(errorToast).toHaveAttribute("data-state", "open");
  });

  it("dismisses a toast from the close button and waits for the exit animation", async () => {
    vi.useFakeTimers();

    render(<div>toast host</div>);

    act(() => {
      toast.info("Dismiss me");
    });

    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: "Dismiss: Dismiss me" }),
      );
    });

    expect(screen.getByText("Dismiss me").closest("[data-state]")).toHaveAttribute(
      "data-state",
      "closed",
    );

    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
  });

  it("limits the stack to five toasts and dedupes matching active toasts", () => {
    vi.useFakeTimers();

    render(<div>toast host</div>);

    act(() => {
      toast.info("Toast 1");
      toast.info("Toast 2");
      toast.info("Toast 3");
      toast.info("Toast 4");
      toast.info("Toast 5");
      toast.info("Toast 6");
      toast.info("Toast 6");
    });

    // Toast 1 was evicted via dismissToast, so it enters exit state
    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    expect(screen.getAllByText("Toast 6")).toHaveLength(1);
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 6")).toBeInTheDocument();
  });

  it("runs the action callback and dismisses the toast", async () => {
    const onUndo = vi.fn();
    const user = userEvent.setup();

    render(<div>toast host</div>);

    act(() => {
      toast.success("Expense deleted.", {
        action: {
          label: "Undo",
          onClick: onUndo,
        },
      });
    });

    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Expense deleted.").closest("[data-state]")).toHaveAttribute(
      "data-state",
      "closed",
    );
  });

  it("pauses auto-dismiss on hover and resumes on mouse leave", () => {
    vi.useFakeTimers();

    render(<div>toast host</div>);

    act(() => {
      toast.success("Hover me");
    });

    const toastCard = screen.getByText("Hover me").closest("[data-state]")!;

    // Hover after 3s — should pause with ~2s remaining
    act(() => {
      vi.advanceTimersByTime(3_000);
    });
    fireEvent.mouseEnter(toastCard);

    // Wait much longer than the original 5s — toast should still be visible
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText("Hover me")).toBeInTheDocument();
    expect(toastCard).toHaveAttribute("data-state", "open");

    // Mouse leave — should resume with ~2s remaining
    fireEvent.mouseLeave(toastCard);

    act(() => {
      vi.advanceTimersByTime(2_000);
    });
    expect(toastCard).toHaveAttribute("data-state", "closed");
  });
});
