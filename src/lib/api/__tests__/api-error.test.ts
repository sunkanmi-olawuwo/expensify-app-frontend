import { describe, expect, it } from "vitest";

import {
  ApiError,
  isApiError,
  isApiProblemDetails,
  normalizeApiError,
} from "../api-error";

describe("api-error", () => {
  it("normalizes problem details and preserves machine code separately from message", () => {
    const error = normalizeApiError({
      detail: "The selected category is already in use.",
      status: 409,
      title: "Expenses.CategoryInUse",
      type: "https://httpstatuses.com/409",
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(409);
    expect(error.code).toBe("Expenses.CategoryInUse");
    expect(error.message).toBe("The selected category is already in use.");
    expect(error.detail).toBe("The selected category is already in use.");
    expect(error.title).toBe("Expenses.CategoryInUse");
    expect(error.isConflict()).toBe(true);
  });

  it("keeps ASP.NET validation metadata as a field map", () => {
    const error = normalizeApiError({
      detail: "Validation failed.",
      errors: {
        amount: ["Amount must be greater than zero."],
        category: ["Category is required."],
      },
      status: 400,
      title: "General.Validation",
    });

    expect(error.isValidationError()).toBe(true);
    expect(error.validationErrors).toEqual({
      amount: ["Amount must be greater than zero."],
      category: ["Category is required."],
    });
  });

  it("supports not found, rate limit, and unauthorized helpers", () => {
    expect(normalizeApiError({ status: 404 }).isNotFound()).toBe(true);
    expect(normalizeApiError({ status: 401 }).isUnauthorized()).toBe(true);
    expect(normalizeApiError({ status: 403 }).isForbidden()).toBe(true);
    expect(normalizeApiError({ status: 429 }).isRateLimited()).toBe(true);
  });

  it("falls back to a raw string message when the payload is not problem details", () => {
    const error = normalizeApiError("Gateway blew up.", {
      status: 500,
      statusText: "Internal Server Error",
    });

    expect(error.status).toBe(500);
    expect(error.message).toBe("Gateway blew up.");
    expect(error.code).toBeNull();
    expect(error.validationErrors).toEqual({});
  });

  it("falls back to status text and a default message for malformed payloads", () => {
    const statusTextError = normalizeApiError({ unexpected: true }, {
      status: 500,
      statusText: "Internal Server Error",
    });
    const defaultError = normalizeApiError(null);

    expect(statusTextError.message).toBe("Internal Server Error");
    expect(defaultError.message).toBe("Something went wrong.");
  });

  it("detects problem details shaped payloads", () => {
    expect(isApiProblemDetails({ errors: { email: ["Invalid"] } })).toBe(true);
    expect(isApiProblemDetails({ detail: "Broken" })).toBe(true);
    expect(isApiProblemDetails({ title: "My Page" })).toBe(false);
    expect(isApiProblemDetails({ title: "General.Validation", status: 400 })).toBe(
      true,
    );
    expect(isApiProblemDetails("not-an-object")).toBe(false);
  });

  it("exposes an ApiError type guard", () => {
    expect(isApiError(normalizeApiError({ status: 500 }))).toBe(true);
    expect(isApiError(new Error("Oops"))).toBe(false);
  });
});
