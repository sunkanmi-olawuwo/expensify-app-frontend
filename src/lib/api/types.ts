export type ApiValidationErrors = Record<string, string[]>;

export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: ApiValidationErrors;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type ApiRequestParamValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number | boolean | Date>
  | null
  | undefined;

export interface ApiRequestOptions {
  params?: Record<string, ApiRequestParamValue>;
  signal?: AbortSignal;
  timeout?: number;
  headers?: HeadersInit;
  auth?: "auto" | "none";
  retryOnUnauthorized?: boolean;
}
