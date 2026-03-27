import { isApiError } from "@/lib/api";

const DEFAULT_TOAST_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function getToastErrorMessage(
  error: unknown,
  fallback = DEFAULT_TOAST_ERROR_MESSAGE,
): string {
  if (isApiError(error)) {
    return error.detail ?? error.message ?? fallback;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
