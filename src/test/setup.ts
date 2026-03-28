import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import { resetToastState } from "@/lib/toast";

import { createMockMatchMedia, resetMatchMediaMocks } from "./match-media";
import {
  getMockPathname,
  getMockRouter,
  getMockSearchParams,
  resetNextNavigationMocks,
} from "./next-navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => getMockPathname(),
  useRouter: () => getMockRouter(),
  useSearchParams: () => getMockSearchParams(),
}));

Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: createMockMatchMedia(),
  writable: true,
});

afterEach(() => {
  document.documentElement.classList.remove("dark", "theme-animating");
  document.documentElement.removeAttribute("data-theme-preference");
  document.documentElement.removeAttribute("data-theme-resolved");
  document.documentElement.style.colorScheme = "light";
  window.localStorage.clear();
  cleanup();
  resetMatchMediaMocks();
  resetToastState();
  resetNextNavigationMocks();
  vi.restoreAllMocks();
});
