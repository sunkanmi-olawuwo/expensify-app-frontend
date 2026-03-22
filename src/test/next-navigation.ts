import { vi } from "vitest";

type SearchParamInput = Record<string, string | undefined> | string | URLSearchParams;

const router = {
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
};

let pathname = "/";
let searchParams = new URLSearchParams();

export function getMockPathname(): string {
  return pathname;
}

export function getMockRouter() {
  return router;
}

export function getMockSearchParams(): URLSearchParams {
  return searchParams;
}

export function setMockPathname(nextPathname: string): void {
  pathname = nextPathname;
}

export function setMockSearchParams(input: SearchParamInput): void {
  if (typeof input === "string" || input instanceof URLSearchParams) {
    searchParams = new URLSearchParams(input);
    return;
  }

  searchParams = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  });
}

export function resetNextNavigationMocks(): void {
  pathname = "/";
  searchParams = new URLSearchParams();
  router.back.mockReset();
  router.forward.mockReset();
  router.prefetch.mockReset().mockResolvedValue(undefined);
  router.push.mockReset();
  router.refresh.mockReset();
  router.replace.mockReset();
}
