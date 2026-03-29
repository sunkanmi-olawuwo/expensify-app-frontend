import { describe, expect, it } from "vitest";

import { pagedUsersResponseSchema } from "../index";

import type { PagedUsersResponse } from "../index";

describe("admin types", () => {
  it("maps curentPage to currentPage for paged users responses", () => {
    const parsed = pagedUsersResponseSchema.parse({
      curentPage: 2,
      page: 2,
      pageSize: 10,
      totalCount: 12,
      totalPages: 2,
      users: [
        {
          email: "admin@test.com",
          firstName: "Admin",
          id: "7c3cbaf6-70ec-4fab-9d0a-3fdc2af4b4bb",
          lastName: "User",
          role: "Admin",
        },
      ],
    }) as PagedUsersResponse;

    expect(parsed.currentPage).toBe(2);
    expect("curentPage" in parsed).toBe(false);
  });
});
