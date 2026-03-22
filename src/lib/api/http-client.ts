import { clearAuthSession, getAccessToken } from "@/lib/auth/auth-store";

import { normalizeApiError } from "./api-error";

import type { ApiRequestOptions, ApiRequestParamValue } from "./types";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

type RequestBody = BodyInit | object | unknown[] | null | undefined;

const DEFAULT_API_URL = "http://localhost:5000/api";

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;

  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

function isAbsoluteUrl(path: string): boolean {
  return /^https?:\/\//i.test(path);
}

function normalizePath(path: string): string {
  return path.replace(/^\/+/, "");
}

function appendQueryParam(
  params: URLSearchParams,
  key: string,
  value: Exclude<ApiRequestParamValue, null | undefined>,
): void {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      appendQueryParam(params, key, item);
    });

    return;
  }

  if (value instanceof Date) {
    params.append(key, value.toISOString());

    return;
  }

  params.append(key, String(value));
}

function buildUrl(path: string, params?: ApiRequestOptions["params"]): string {
  const url = isAbsoluteUrl(path)
    ? new URL(path)
    : new URL(normalizePath(path), getApiBaseUrl());

  if (!params) {
    return url.toString();
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    appendQueryParam(url.searchParams, key, value);
  });

  return url.toString();
}

function isBodyInit(value: RequestBody): value is BodyInit {
  return (
    typeof value === "string" ||
    value instanceof FormData ||
    value instanceof Blob ||
    value instanceof URLSearchParams ||
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    value instanceof ReadableStream
  );
}

function createTimeoutError(timeout: number): Error {
  if (typeof DOMException !== "undefined") {
    return new DOMException(
      `Request timed out after ${timeout}ms.`,
      "TimeoutError",
    );
  }

  const error = new Error(`Request timed out after ${timeout}ms.`);
  error.name = "TimeoutError";

  return error;
}

function createAbortController(
  signal?: AbortSignal,
  timeout?: number,
): { cleanup: () => void; signal: AbortSignal } {
  const controller = new AbortController();
  const cleanupCallbacks: Array<() => void> = [];

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      const abortFromSignal = () => controller.abort(signal.reason);

      signal.addEventListener("abort", abortFromSignal, { once: true });
      cleanupCallbacks.push(() =>
        signal.removeEventListener("abort", abortFromSignal),
      );
    }
  }

  if (timeout && timeout > 0) {
    const timeoutId = setTimeout(() => {
      controller.abort(createTimeoutError(timeout));
    }, timeout);

    cleanupCallbacks.push(() => clearTimeout(timeoutId));
  }

  return {
    cleanup: () => {
      cleanupCallbacks.forEach((callback) => callback());
    },
    signal: controller.signal,
  };
}

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  const normalizedContentType = contentType.toLowerCase();

  return (
    normalizedContentType.includes("application/json") ||
    normalizedContentType.includes("+json")
  );
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const text = await response.text();

  if (!text) {
    return undefined;
  }

  if (!isJsonContentType(response.headers.get("content-type"))) {
    return text;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function createHeaders(headers?: HeadersInit): Headers {
  const requestHeaders = new Headers(headers);
  const accessToken = getAccessToken();

  if (accessToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return requestHeaders;
}

function serializeBody(
  body: RequestBody,
  headers: Headers,
): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isBodyInit(body)) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

export const browserNavigation = {
  redirectToLogin(): void {
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  },
};

function handleUnauthorizedResponse(): void {
  clearAuthSession();
  browserNavigation.redirectToLogin();
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: RequestBody,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { cleanup, signal } = createAbortController(
    options.signal,
    options.timeout,
  );
  const headers = createHeaders(options.headers);
  const url = buildUrl(path, options.params);

  try {
    const response = await fetch(url, {
      body: serializeBody(body, headers),
      headers,
      method,
      signal,
    });

    const parsedBody = await parseResponseBody(response);

    if (!response.ok) {
      const error = normalizeApiError(parsedBody, {
        status: response.status,
        statusText: response.statusText,
      });

      if (error.isUnauthorized()) {
        handleUnauthorizedResponse();
      }

      throw error;
    }

    return parsedBody as T;
  } finally {
    cleanup();
  }
}

export const httpClient = {
  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },
  patch<T>(
    path: string,
    body?: RequestBody,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },
  post<T>(
    path: string,
    body?: RequestBody,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return request<T>("POST", path, body, options);
  },
  put<T>(
    path: string,
    body?: RequestBody,
    options?: ApiRequestOptions,
  ): Promise<T> {
    return request<T>("PUT", path, body, options);
  },
};
