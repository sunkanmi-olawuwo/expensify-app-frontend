import { beforeEach, describe, expect, it, vi } from "vitest";

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  httpClient: {
    post: postMock,
  },
}));

import { authService } from "../auth-service";

describe("auth-service", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("registers through the public endpoint with auth disabled", async () => {
    postMock.mockResolvedValue({ userId: "user-1" });

    await expect(
      authService.register({
        email: "user@example.com",
        firstName: "Morgan",
        lastName: "Lee",
        password: "secret123",
        role: "User",
      }),
    ).resolves.toEqual({ userId: "user-1" });

    expect(postMock).toHaveBeenCalledWith(
      "/v1/users/register",
      {
        email: "user@example.com",
        firstName: "Morgan",
        lastName: "Lee",
        password: "secret123",
        role: "User",
      },
      {
        auth: "none",
      },
    );
  });

  it("logs in and refreshes tokens through auth-free endpoints", async () => {
    postMock
      .mockResolvedValueOnce({
        refreshToken: "refresh-1",
        token: "token-1",
      })
      .mockResolvedValueOnce({
        refreshToken: "refresh-2",
        token: "token-2",
      });

    await expect(
      authService.login({
        email: "user@example.com",
        password: "secret123",
      }),
    ).resolves.toEqual({
      refreshToken: "refresh-1",
      token: "token-1",
    });
    await expect(
      authService.refreshTokens({
        refreshToken: "refresh-1",
        token: "token-1",
      }),
    ).resolves.toEqual({
      refreshToken: "refresh-2",
      token: "token-2",
    });

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      "/v1/users/login",
      {
        email: "user@example.com",
        password: "secret123",
      },
      {
        auth: "none",
      },
    );
    expect(postMock).toHaveBeenNthCalledWith(
      2,
      "/v1/users/refresh",
      {
        refreshToken: "refresh-1",
        token: "token-1",
      },
      {
        auth: "none",
        retryOnUnauthorized: false,
      },
    );
  });

  it("calls the protected logout and change-password endpoints", async () => {
    postMock.mockResolvedValue(undefined);

    await authService.logout();
    await authService.changePassword({
      currentPassword: "old-secret",
      newPassword: "new-secret",
    });

    expect(postMock).toHaveBeenNthCalledWith(1, "/v1/users/logout");
    expect(postMock).toHaveBeenNthCalledWith(
      2,
      "/v1/users/change-password",
      {
        currentPassword: "old-secret",
        newPassword: "new-secret",
      },
    );
  });

  it("sends forgot and reset password payloads to the public endpoints", async () => {
    postMock.mockResolvedValue(undefined);

    await authService.forgotPassword({ email: "user@example.com" });
    await authService.resetPassword({
      email: "user@example.com",
      newPassword: "secret123",
      token: "reset-token",
    });

    expect(postMock).toHaveBeenNthCalledWith(
      1,
      "/v1/users/forgot-password",
      {
        email: "user@example.com",
      },
      {
        auth: "none",
      },
    );
    expect(postMock).toHaveBeenNthCalledWith(
      2,
      "/v1/users/reset-password",
      {
        email: "user@example.com",
        newPassword: "secret123",
        token: "reset-token",
      },
      {
        auth: "none",
      },
    );
  });
});
