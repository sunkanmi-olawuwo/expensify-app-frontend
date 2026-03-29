import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ApiError, createQueryClient, QueryClientProvider } from "@/lib/api";
import { toast } from "@/lib/toast";

import * as adminUsersService from "../../services/admin-users-service";
import { useDeleteUser } from "../use-delete-user";

import type { PropsWithChildren } from "react";

const sampleUser = {
  email: "admin@test.com",
  firstName: "Admin",
  id: "7c3cbaf6-70ec-4fab-9d0a-3fdc2af4b4bb",
  lastName: "User",
  role: "Admin",
} as const;

function createWrapper() {
  const client = createQueryClient();

  function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }

  return {
    client,
    Wrapper,
  };
}

describe("useDeleteUser", () => {
  it("shows a success toast, invalidates users, and completes on success", async () => {
    const { client, Wrapper } = createWrapper();
    const onComplete = vi.fn();

    vi.spyOn(adminUsersService, "deleteUser").mockResolvedValue(undefined);
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("toast-1");
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser({ onComplete }), {
      wrapper: Wrapper,
    });

    result.current.mutate(sampleUser);

    await waitFor(() => {
      expect(successSpy).toHaveBeenCalledWith("Admin User was deleted.", {
        dedupeKey: `admin-users:delete:success:${sampleUser.id}`,
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["admin", "users"],
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("treats 404 as already deleted and still completes", async () => {
    const { client, Wrapper } = createWrapper();
    const onComplete = vi.fn();

    vi.spyOn(adminUsersService, "deleteUser").mockRejectedValue(
      new ApiError({
        detail: "User was not found.",
        message: "User was not found.",
        status: 404,
      }),
    );
    const infoSpy = vi.spyOn(toast, "info").mockReturnValue("toast-1");
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser({ onComplete }), {
      wrapper: Wrapper,
    });

    result.current.mutate(sampleUser);

    await waitFor(() => {
      expect(infoSpy).toHaveBeenCalledWith("Admin User was already deleted.", {
        dedupeKey: `admin-users:delete:not-found:${sampleUser.id}`,
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["admin", "users"],
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("shows the permission toast for 403 responses without closing the dialog", async () => {
    const { client, Wrapper } = createWrapper();
    const onComplete = vi.fn();

    vi.spyOn(adminUsersService, "deleteUser").mockRejectedValue(
      new ApiError({
        detail: "Forbidden.",
        message: "Forbidden.",
        status: 403,
      }),
    );
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("toast-1");
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeleteUser({ onComplete }), {
      wrapper: Wrapper,
    });

    result.current.mutate(sampleUser);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "You do not have permission to delete users.",
        {
          dedupeKey: `admin-users:delete:forbidden:${sampleUser.id}`,
        },
      );
    });

    expect(invalidateSpy).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("shows a generic error toast for unexpected failures and keeps the dialog open", async () => {
    const { Wrapper } = createWrapper();
    const onComplete = vi.fn();

    vi.spyOn(adminUsersService, "deleteUser").mockRejectedValue(
      new ApiError({
        detail: "Internal server error.",
        message: "Internal server error.",
        status: 500,
      }),
    );
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("toast-1");

    const { result } = renderHook(() => useDeleteUser({ onComplete }), {
      wrapper: Wrapper,
    });

    result.current.mutate(sampleUser);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });

    expect(onComplete).not.toHaveBeenCalled();
  });
});
