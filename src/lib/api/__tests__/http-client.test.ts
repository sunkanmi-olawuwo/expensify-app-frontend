import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "../api-error";
import { browserNavigation, httpClient } from "../http-client";

const ACCESS_TOKEN_STORAGE_KEY = "expensify.auth.accessToken";

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/problem+json",
    },
    ...init,
  });
}

describe("http-client", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/root";
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("builds URLs with query params and omits nullish values", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          items: [],
          page: 1,
          pageSize: 25,
          totalCount: 0,
          totalPages: 0,
        },
        { status: 200 },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    await httpClient.get("/transactions", {
      params: {
        archived: false,
        month: 3,
        pageSize: 25,
        skipped: undefined,
        tags: ["food", "travel"],
        when: new Date("2026-03-15T10:00:00.000Z"),
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    const url = new URL(requestUrl);

    expect(url.origin + url.pathname).toBe(
      "https://api.example.com/root/transactions",
    );
    expect(url.searchParams.get("month")).toBe("3");
    expect(url.searchParams.getAll("tags")).toEqual(["food", "travel"]);
    expect(url.searchParams.get("when")).toBe("2026-03-15T10:00:00.000Z");
    expect(url.searchParams.get("pageSize")).toBe("25");
    expect(url.searchParams.get("archived")).toBe("false");
    expect(url.searchParams.has("skipped")).toBe(false);
    expect(requestInit.method).toBe("GET");
  });

  it("injects the bearer token when present in storage", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true }, { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, "test-token");

    await httpClient.get("/profile");

    const [, requestInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    const headers = requestInit.headers as Headers;

    expect(headers.get("Authorization")).toBe("Bearer test-token");
  });

  it("serializes JSON request bodies and respects caller content type overrides", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ id: "txn_1" }, { status: 200 }));

    vi.stubGlobal("fetch", fetchMock);

    await httpClient.post(
      "/transactions",
      {
        amount: 12.5,
        merchant: "Corner Store",
      },
      {
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      },
    );

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestInit.headers as Headers;

    expect(requestInit.body).toBe(
      JSON.stringify({
        amount: 12.5,
        merchant: "Corner Store",
      }),
    );
    expect(headers.get("Content-Type")).toBe("application/vnd.api+json");
  });

  it("parses JSON success responses and returns undefined for 204 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ total: 12 }), {
            headers: {
              "Content-Type": "application/json",
            },
            status: 200,
          }),
        )
        .mockResolvedValueOnce(new Response(null, { status: 204 })),
    );

    await expect(httpClient.get<{ total: number }>("/metrics")).resolves.toEqual(
      {
        total: 12,
      },
    );
    await expect(httpClient.delete<void>("/metrics")).resolves.toBeUndefined();
  });

  it("normalizes problem details failures into ApiError", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            detail: "Category not found.",
            status: 404,
            title: "Expenses.NotFound",
          },
          { status: 404, statusText: "Not Found" },
        ),
      ),
    );

    await expect(httpClient.get("/transactions/missing")).rejects.toMatchObject({
      code: "Expenses.NotFound",
      detail: "Category not found.",
      message: "Category not found.",
      status: 404,
    });
  });

  it("falls back to raw text on unexpected non-json failures", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Gateway timeout", {
          headers: {
            "Content-Type": "text/plain",
          },
          status: 500,
          statusText: "Internal Server Error",
        }),
      ),
    );

    await expect(httpClient.get("/transactions")).rejects.toMatchObject({
      message: "Gateway timeout",
      status: 500,
    });
  });

  it("clears auth state and redirects on 401 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            detail: "Session expired.",
            status: 401,
            title: "Auth.Expired",
          },
          { status: 401, statusText: "Unauthorized" },
        ),
      ),
    );
    const assignSpy = vi
      .spyOn(browserNavigation, "redirectToLogin")
      .mockImplementation(() => undefined);
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, "expired-token");

    await expect(httpClient.get("/profile")).rejects.toBeInstanceOf(ApiError);

    expect(window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(assignSpy).toHaveBeenCalledTimes(1);
  });

  it("propagates fetch rejections for network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed")));

    await expect(httpClient.get("/transactions")).rejects.toThrow("Failed");
  });

  it("honors caller abort signals", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockImplementation(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const request = httpClient.get("/transactions", {
      signal: controller.signal,
    });

    controller.abort();

    await expect(request).rejects.toMatchObject({ name: "AbortError" });
  });

  it("aborts timed out requests", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn().mockImplementation(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(init?.signal?.reason);
          });
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const request = httpClient.get("/transactions", { timeout: 50 });
    const timeoutExpectation = expect(request).rejects.toMatchObject({
      name: "TimeoutError",
    });

    try {
      await vi.advanceTimersByTimeAsync(50);
      await timeoutExpectation;
    } finally {
      vi.useRealTimers();
    }
  });
});
