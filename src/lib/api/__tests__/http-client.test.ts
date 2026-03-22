import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setStoredUser, setTokens } from "@/lib/auth";
import { createMockJwt } from "@/test/jwt";

import { ApiError } from "../api-error";
import { browserNavigation, httpClient } from "../http-client";

function jsonResponse(
  body: unknown,
  init?: ResponseInit,
  contentType = "application/json",
): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": contentType,
    },
    ...init,
  });
}

function createUserToken(subject: string) {
  return createMockJwt({
    email: `${subject}@example.com`,
    exp: Math.floor(Date.now() / 1000) + 3600,
    firstName: "Morgan",
    lastName: "Lee",
    role: "User",
    sub: subject,
  });
}

function createBackendUserToken(email: string, userId: string) {
  return createMockJwt({
    exp: Math.floor(Date.now() / 1000) + 3600,
    role: "User",
    sub: email,
    userid: userId,
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
    setTokens(createUserToken("user-1"), "refresh-1");

    await httpClient.get("/profile");

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(requestInit.headers);

    expect(headers.get("Authorization")).toMatch(/^Bearer /);
  });

  it("skips auth injection when auth mode is none", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ ok: true }, { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);
    setTokens(createUserToken("user-1"), "refresh-1");

    await httpClient.post(
      "/v1/users/login",
      { email: "user@example.com" },
      { auth: "none" },
    );

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(requestInit.headers);

    expect(headers.get("Authorization")).toBeNull();
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
    const headers = new Headers(requestInit.headers);

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
          "application/problem+json",
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

  it("refreshes tokens after a 401 and retries the original request once", async () => {
    const expiredToken = createUserToken("user-1");
    const refreshedToken = createBackendUserToken("user-1@example.com", "user-1");

    setTokens(expiredToken, "refresh-1");
    setStoredUser({
      email: "user-1@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      role: "User",
    });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          jsonResponse(
            {
              detail: "Session expired.",
              status: 401,
              title: "Auth.Expired",
            },
            { status: 401, statusText: "Unauthorized" },
            "application/problem+json",
          ),
        )
        .mockResolvedValueOnce(
          jsonResponse(
            {
              refreshToken: "refresh-2",
              token: refreshedToken,
            },
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(jsonResponse({ ok: true }, { status: 200 })),
    );

    await expect(httpClient.get("/profile")).resolves.toEqual({ ok: true });

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    const refreshRequest = fetchMock.mock.calls[1] as [string, RequestInit];
    const retriedRequest = fetchMock.mock.calls[2] as [string, RequestInit];

    expect(refreshRequest[0]).toBe("https://api.example.com/root/v1/users/refresh");
    expect(refreshRequest[1].body).toBe(
      JSON.stringify({
        refreshToken: "refresh-1",
        token: expiredToken,
      }),
    );
    expect(new Headers(retriedRequest[1].headers).get("Authorization")).toBe(
      `Bearer ${refreshedToken}`,
    );
  });

  it("deduplicates concurrent refresh requests", async () => {
    const expiredToken = createUserToken("user-1");
    const refreshedToken = createUserToken("user-2");
    let refreshCalls = 0;

    setTokens(expiredToken, "refresh-1");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const authHeader = new Headers(init?.headers).get("Authorization");

        if (url.endsWith("/v1/users/refresh")) {
          refreshCalls += 1;

          return jsonResponse(
            {
              refreshToken: "refresh-2",
              token: refreshedToken,
            },
            { status: 200 },
          );
        }

        if (authHeader === `Bearer ${expiredToken}`) {
          return jsonResponse(
            {
              detail: "Session expired.",
              status: 401,
              title: "Auth.Expired",
            },
            { status: 401, statusText: "Unauthorized" },
            "application/problem+json",
          );
        }

        return jsonResponse({ ok: true }, { status: 200 });
      }),
    );

    await Promise.all([httpClient.get("/profile"), httpClient.get("/settings")]);

    expect(refreshCalls).toBe(1);
  });

  it("clears auth state and redirects when refresh fails", async () => {
    const expiredToken = createUserToken("user-1");

    setTokens(expiredToken, "refresh-1");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          jsonResponse(
            {
              detail: "Session expired.",
              status: 401,
              title: "Auth.Expired",
            },
            { status: 401, statusText: "Unauthorized" },
            "application/problem+json",
          ),
        )
        .mockResolvedValueOnce(
          jsonResponse(
            {
              detail: "Refresh token expired.",
              status: 401,
              title: "Auth.RefreshExpired",
            },
            { status: 401, statusText: "Unauthorized" },
            "application/problem+json",
          ),
        ),
    );
    const redirectSpy = vi
      .spyOn(browserNavigation, "redirectToLogin")
      .mockImplementation(() => undefined);

    await expect(httpClient.get("/profile")).rejects.toBeInstanceOf(ApiError);

    expect(redirectSpy).toHaveBeenCalledWith("session_expired");
    expect(window.localStorage.length).toBe(0);
  });

  it("surfaces rate-limit responses with the retry-after delay", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            detail: "Slow down.",
            status: 429,
            title: "RateLimit.Exceeded",
          },
          {
            headers: {
              "Content-Type": "application/problem+json",
              "Retry-After": "120",
            },
            status: 429,
            statusText: "Too Many Requests",
          },
          "application/problem+json",
        ),
      ),
    );

    await expect(httpClient.get("/transactions")).rejects.toMatchObject({
      message: "Too many requests. Please try again in 120 seconds.",
      status: 429,
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
