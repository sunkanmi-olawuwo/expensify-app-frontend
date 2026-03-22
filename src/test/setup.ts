import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

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

afterEach(() => {
  window.localStorage.clear();
  cleanup();
  resetNextNavigationMocks();
  vi.restoreAllMocks();
});
