import {
  clearAuthSession,
  decodeUser,
  getRefreshToken,
  getStoredUser,
  getToken,
  setStoredUser,
  setTokens,
} from "@/lib/auth/auth-store";
import { refreshResponseSchema } from "@/lib/auth/types";

import { ApiError, normalizeApiError } from "./api-error";

import type {
  ApiRequestOptions,
  ApiRequestParamValue,
  ApiResponse,
} from "./types";

type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

type RequestBody = BodyInit | object | unknown[] | null | undefined;

type RequestConfig = {
  body?: RequestBody;
  method: HttpMethod;
  options: ApiRequestOptions;
  path: string;
};

type ResponsePayload = {
  parsedBody: unknown;
  response: Response;
};

const DEFAULT_API_URL = "http://localhost:5000/api";
const REFRESH_PATH = "/v1/users/refresh";

let refreshPromise: Promise<string> | null = null;

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

function createHeaders(
  headers?: HeadersInit,
  authMode: ApiRequestOptions["auth"] = "auto",
  tokenOverride?: string | null,
): Headers {
  const requestHeaders = new Headers(headers);

  if (authMode !== "none") {
    const token = tokenOverride ?? getToken();

    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
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

function getRetryAfterMs(retryAfterHeader: string | null): number | null {
  if (!retryAfterHeader) {
    return null;
  }

  const retryAfterSeconds = Number(retryAfterHeader);

  if (Number.isFinite(retryAfterSeconds)) {
    return Math.max(0, retryAfterSeconds * 1000);
  }

  const retryAt = Date.parse(retryAfterHeader);

  if (Number.isNaN(retryAt)) {
    return null;
  }

  return Math.max(0, retryAt - Date.now());
}

function createRateLimitError(
  error: ApiError,
  retryAfterHeader: string | null,
): ApiError {
  const retryAfterMs = getRetryAfterMs(retryAfterHeader);
  const retryAfterSeconds =
    retryAfterMs === null ? null : Math.max(1, Math.ceil(retryAfterMs / 1000));
  const message =
    retryAfterSeconds === null
      ? "Too many requests. Please try again shortly."
      : `Too many requests. Please try again in ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`;

  return new ApiError({
    code: error.code,
    detail: message,
    instance: error.instance,
    message,
    raw: error.raw,
    status: error.status,
    title: error.title,
    type: error.type,
    validationErrors: error.validationErrors,
  });
}

async function sendRequest(
  config: RequestConfig,
  tokenOverride?: string | null,
): Promise<ResponsePayload> {
  const { cleanup, signal } = createAbortController(
    config.options.signal,
    config.options.timeout,
  );
  const headers = createHeaders(
    config.options.headers,
    config.options.auth,
    tokenOverride,
  );
  const url = buildUrl(config.path, config.options.params);

  try {
    const response = await fetch(url, {
      body: serializeBody(config.body, headers),
      headers,
      method: config.method,
      signal,
    });

    return {
      parsedBody: await parseResponseBody(response),
      response,
    };
  } finally {
    cleanup();
  }
}

async function refreshTokens(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const token = getToken();
    const refreshToken = getRefreshToken();

    if (!token || !refreshToken) {
      throw new Error("Missing token pair for refresh.");
    }

    const response = await fetch(buildUrl(REFRESH_PATH), {
      body: JSON.stringify({ refreshToken, token }),
      headers: createHeaders(
        {
          "Content-Type": "application/json",
        },
        "none",
      ),
      method: "POST",
    });
    const parsedBody = await parseResponseBody(response);

    if (!response.ok) {
      throw normalizeApiError(parsedBody, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const refreshed = refreshResponseSchema.parse(parsedBody);
    const refreshedUser = decodeUser(refreshed.token, getStoredUser());

    setTokens(refreshed.token, refreshed.refreshToken);

    if (refreshedUser) {
      setStoredUser(refreshedUser);
    }

    return refreshed.token;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export const browserNavigation = {
  redirectToLogin(status?: string): void {
    if (typeof window === "undefined") {
      return;
    }

    const target = new URL("/login", window.location.origin);

    if (status) {
      target.searchParams.set("status", status);
    }

    window.location.assign(`${target.pathname}${target.search}`);
  },
};

function handleUnauthorizedResponse(status = "session_expired"): void {
  clearAuthSession();
  browserNavigation.redirectToLogin(status);
}

async function executeRequest<T>(
  config: RequestConfig,
  tokenOverride?: string | null,
): Promise<T> {
  const { parsedBody, response } = await sendRequest(config, tokenOverride);

  if (response.ok) {
    return parsedBody as T;
  }

  let error = normalizeApiError(parsedBody, {
    status: response.status,
    statusText: response.statusText,
  });

  if (response.status === 429) {
    error = createRateLimitError(error, response.headers.get("Retry-After"));
  }

  if (error.isUnauthorized() && config.options.auth !== "none") {
    if (config.options.retryOnUnauthorized !== false) {
      try {
        const refreshedToken = await refreshTokens();

        return await executeRequest<T>(
          {
            ...config,
            options: {
              ...config.options,
              retryOnUnauthorized: false,
            },
          },
          refreshedToken,
        );
      } catch {
        handleUnauthorizedResponse();
        throw error;
      }
    } else {
      handleUnauthorizedResponse();
    }
  }

  throw error;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: RequestBody,
  options: ApiRequestOptions = {},
): Promise<T> {
  return executeRequest<T>({
    body,
    method,
    options: {
      auth: "auto",
      retryOnUnauthorized: true,
      ...options,
    },
    path,
  });
}

async function executeRequestWithResponse<T>(
  config: RequestConfig,
  tokenOverride?: string | null,
): Promise<{ parsedBody: T; response: Response }> {
  const { parsedBody, response } = await sendRequest(config, tokenOverride);

  if (response.ok) {
    return {
      parsedBody: parsedBody as T,
      response,
    };
  }

  let error = normalizeApiError(parsedBody, {
    status: response.status,
    statusText: response.statusText,
  });

  if (response.status === 429) {
    error = createRateLimitError(error, response.headers.get("Retry-After"));
  }

  if (error.isUnauthorized() && config.options.auth !== "none") {
    if (config.options.retryOnUnauthorized !== false) {
      try {
        const refreshedToken = await refreshTokens();

        return await executeRequestWithResponse<T>(
          {
            ...config,
            options: {
              ...config.options,
              retryOnUnauthorized: false,
            },
          },
          refreshedToken,
        );
      } catch {
        handleUnauthorizedResponse();
        throw error;
      }
    } else {
      handleUnauthorizedResponse();
    }
  }

  throw error;
}

async function requestWithResponse<T>(
  method: HttpMethod,
  path: string,
  body?: RequestBody,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { parsedBody, response } = await executeRequestWithResponse<T>({
    body,
    method,
    options: {
      auth: "auto",
      retryOnUnauthorized: true,
      ...options,
    },
    path,
  });

  return {
    data: parsedBody,
    response,
  };
}

export const httpClient = {
  delete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
  get<T>(path: string, options?: ApiRequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },
  getResponse<T>(path: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return requestWithResponse<T>("GET", path, undefined, options);
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
