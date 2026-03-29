import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/render";

import { useDebouncedValue } from "../use-debounced-value";

function DebouncedValueProbe({
  delayMs,
  value,
}: {
  delayMs?: number;
  value: string;
}) {
  const debouncedValue = useDebouncedValue(value, delayMs);

  return <span>{debouncedValue}</span>;
}

describe("useDebouncedValue", () => {
  it("delays updates until the debounce window elapses", async () => {
    vi.useFakeTimers();

    try {
      const { rerender } = render(<DebouncedValueProbe value="alpha" />);

      expect(screen.getByText("alpha")).toBeInTheDocument();

      rerender(<DebouncedValueProbe value="bravo" />);

      expect(screen.queryByText("bravo")).not.toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(299);
      });

      expect(screen.queryByText("bravo")).not.toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1);
      });

      expect(screen.getByText("bravo")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
