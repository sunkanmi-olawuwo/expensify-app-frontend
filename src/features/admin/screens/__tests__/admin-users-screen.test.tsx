import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@/test/render";

import { useAdminUsers } from "../../hooks/use-admin-users";
import { useDeleteUser } from "../../hooks/use-delete-user";
import { AdminUsersScreen } from "../admin-users-screen";

vi.mock("@/lib/hooks", () => ({
  useDebouncedValue: (value: string) => value,
}));

vi.mock("../../hooks/use-admin-users", () => ({
  useAdminUsers: vi.fn(),
}));

vi.mock("../../hooks/use-delete-user", () => ({
  useDeleteUser: vi.fn(),
}));

const mockUseAdminUsers = vi.mocked(useAdminUsers);
const mockUseDeleteUser = vi.mocked(useDeleteUser);

const sampleUser = {
  email: "admin@test.com",
  firstName: "Admin",
  id: "7c3cbaf6-70ec-4fab-9d0a-3fdc2af4b4bb",
  lastName: "User",
  role: "Admin",
};

describe("AdminUsersScreen", () => {
  beforeEach(() => {
    mockUseAdminUsers.mockImplementation(() => ({
      data: {
        pagination: {
          currentPage: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 3,
        },
        users: [sampleUser],
      },
      isFetching: false,
      isLoading: false,
    }) as ReturnType<typeof useAdminUsers>);
    mockUseDeleteUser.mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
      variables: undefined,
    } as unknown as ReturnType<typeof useDeleteUser>);
  });

  it("updates filters and resets pagination when the toolbar changes", async () => {
    const user = userEvent.setup();

    render(<AdminUsersScreen />);

    await user.click(screen.getByRole("button", { name: "Go to page 2" }));

    await waitFor(() => {
      expect(mockUseAdminUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });

    await user.type(screen.getByLabelText("Search users"), "morgan");

    await waitFor(() => {
      expect(mockUseAdminUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          searchQuery: "morgan",
        }),
      );
    });
  });

  it("renders user rows with navigation links and opens the delete dialog", async () => {
    const user = userEvent.setup();

    render(<AdminUsersScreen />);

    const userLink = screen.getAllByRole("link", { name: /Admin User/ })[0]!;

    expect(userLink).toHaveAttribute(
      "href",
      `/admin/users/${sampleUser.id}`,
    );

    await user.click(
      screen.getAllByRole("button", { name: "Delete Admin User" })[0]!,
    );

    expect(screen.getByText("Delete user")).toBeInTheDocument();
    expect(
      screen.getByText(/Delete Admin User \(admin@test.com\)/),
    ).toBeInTheDocument();
  });
});
