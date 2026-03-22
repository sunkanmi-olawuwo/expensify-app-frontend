import type { ApiErrorItem, ApiProblemDetails } from "./types";

const DEFAULT_ERROR_MESSAGE = "Something went wrong.";

type ApiErrorInit = {
  status?: number | null;
  code?: string | null;
  title?: string | null;
  detail?: string | null;
  type?: string | null;
  instance?: string | null;
  validationErrors?: ApiErrorItem[];
  raw?: unknown;
  message?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasProblemDetailsSignals(value: Record<string, unknown>): boolean {
  const hasStatus = typeof value.status === "number";
  const hasDetail = typeof value.detail === "string";
  const hasType = typeof value.type === "string";
  const hasErrors = Array.isArray(value.errors);

  return hasStatus || hasDetail || hasType || hasErrors;
}

function asOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeApiErrorItem(input: unknown): ApiErrorItem | null {
  if (!isRecord(input)) {
    return null;
  }

  const code = asOptionalString(input.code);
  const description = asOptionalString(input.description);
  const type = asOptionalString(input.type) ?? undefined;

  if (!code || !description) {
    return null;
  }

  return {
    code,
    description,
    type,
  };
}

function normalizeValidationErrors(input: unknown): ApiErrorItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => normalizeApiErrorItem(item))
    .filter((item): item is ApiErrorItem => item !== null);
}

export function isApiProblemDetails(
  input: unknown,
): input is ApiProblemDetails {
  if (!isRecord(input)) {
    return false;
  }

  const hasTitle = typeof input.title === "string";

  return hasProblemDetailsSignals(input) || (hasTitle && "status" in input);
}

export function normalizeApiError(
  input: unknown,
  fallback?: {
    status?: number | null;
    statusText?: string | null;
  },
): ApiError {
  const problem = isApiProblemDetails(input) ? input : null;

  const status =
    typeof problem?.status === "number" ? problem.status : fallback?.status ?? null;
  const title = asOptionalString(problem?.title) ?? null;
  const detail = asOptionalString(problem?.detail) ?? null;
  const type = asOptionalString(problem?.type) ?? null;
  const instance = asOptionalString(problem?.instance) ?? null;
  const textFallback =
    typeof input === "string" && input.trim().length > 0 ? input : null;

  return new ApiError({
    code: title,
    detail,
    instance,
    message: detail ?? title ?? textFallback ?? fallback?.statusText ?? DEFAULT_ERROR_MESSAGE,
    raw: input,
    status,
    title,
    type,
    validationErrors: normalizeValidationErrors(problem?.errors),
  });
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string | null;
  readonly title: string | null;
  readonly detail: string | null;
  readonly type: string | null;
  readonly instance: string | null;
  readonly validationErrors: ApiErrorItem[];
  readonly raw?: unknown;

  constructor({
    status = null,
    code = null,
    title = null,
    detail = null,
    type = null,
    instance = null,
    validationErrors = [],
    raw,
    message,
  }: ApiErrorInit) {
    super(message ?? detail ?? title ?? DEFAULT_ERROR_MESSAGE);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.type = type;
    this.instance = instance;
    this.validationErrors = validationErrors;
    this.raw = raw;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isValidationError(): boolean {
    return this.status === 400;
  }

  isConflict(): boolean {
    return this.status === 409;
  }

  isRateLimited(): boolean {
    return this.status === 429;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
