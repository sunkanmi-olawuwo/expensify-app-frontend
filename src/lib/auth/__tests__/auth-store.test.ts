import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockJwt } from "@/test/jwt";

import {
  clearAuthSession,
  decodeAuthClaims,
  decodeUser,
  getRefreshToken,
  getStoredUser,
  getToken,
  isTokenExpired,
  setStoredUser,
  setTokens,
} from "../auth-store";

describe("auth-store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and retrieves the token pair", () => {
    setTokens("token-123", "refresh-123");

    expect(getToken()).toBe("token-123");
    expect(getRefreshToken()).toBe("refresh-123");
  });

  it("stores and retrieves the user snapshot", () => {
    setStoredUser({
      email: "user@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      role: "User",
    });

    expect(getStoredUser()).toEqual({
      email: "user@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      role: "User",
    });
  });

  it("decodes user claims from a JWT and detects expiry", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-22T12:00:00.000Z"));

    try {
      const activeToken = createMockJwt({
        email: "user@example.com",
        exp: Math.floor(Date.now() / 1000) + 60,
        firstName: "Morgan",
        lastName: "Lee",
        role: "User",
        sub: "user-1",
      });
      const expiredToken = createMockJwt({
        email: "user@example.com",
        exp: Math.floor(Date.now() / 1000) - 60,
        firstName: "Morgan",
        lastName: "Lee",
        role: "User",
        sub: "user-1",
      });

      expect(decodeUser(activeToken)).toEqual({
        email: "user@example.com",
        firstName: "Morgan",
        id: "user-1",
        lastName: "Lee",
        role: "User",
      });
      expect(isTokenExpired(activeToken)).toBe(false);
      expect(isTokenExpired(expiredToken)).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("maps the backend JWT claim shape and falls back to the stored user for names", () => {
    const backendToken = createMockJwt({
      exp: Math.floor(Date.now() / 1000) + 60,
      role: "User",
      sub: "user@example.com",
      userid: "user-1",
    });
    const storedUser = {
      email: "user@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      role: "User",
    };

    expect(decodeAuthClaims(backendToken)).toEqual({
      email: "user@example.com",
      firstName: null,
      id: "user-1",
      lastName: null,
      role: "User",
    });
    expect(decodeUser(backendToken, storedUser)).toEqual(storedUser);
  });

  it("returns null when the token is malformed or missing required claims", () => {
    const invalidToken = createMockJwt({
      exp: Math.floor(Date.now() / 1000) + 60,
      sub: "user@example.com",
    });

    expect(decodeAuthClaims("not-a-jwt")).toBeNull();
    expect(decodeUser(invalidToken)).toBeNull();
  });

  it("clears the full auth session", () => {
    setTokens("token-123", "refresh-123");
    setStoredUser({
      email: "user@example.com",
      firstName: "Morgan",
      id: "user-1",
      lastName: "Lee",
      role: "User",
    });

    clearAuthSession();

    expect(getToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
