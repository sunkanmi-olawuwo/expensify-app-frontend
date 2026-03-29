import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUsers, parsePaginationHeaders } from "../admin-users-service";

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

describe("admin-users-service", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/root";
  });

  afterEach(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("maps filter params and prefers pagination headers over the body envelope", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          curentPage: 1,
          page: 1,
          pageSize: 10,
          totalCount: 99,
          totalPages: 10,
          users: [
            {
              email: "admin@test.com",
              firstName: "Admin",
              id: "7c3cbaf6-70ec-4fab-9d0a-3fdc2af4b4bb",
              lastName: "User",
              role: "Admin",
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Pagination-CurrentPage": "2",
            "X-Pagination-PageSize": "25",
            "X-Pagination-TotalCount": "50",
            "X-Pagination-TotalPages": "2",
          },
          status: 200,
        },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await getUsers({
      filterBy: "role",
      filterQuery: "Admin",
      page: 2,
      pageSize: 25,
      searchQuery: " Morgan ",
      sortBy: "LastName",
      sortOrder: "desc",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
    const url = new URL(requestUrl);

    expect(url.origin + url.pathname).toBe("https://api.example.com/root/v1/users");
    expect(url.searchParams.get("FilterBy")).toBe("role");
    expect(url.searchParams.get("FilterQuery")).toBe("Admin");
    expect(url.searchParams.get("Page")).toBe("2");
    expect(url.searchParams.get("PageSize")).toBe("25");
    expect(url.searchParams.get("SearchQuery")).toBe("Morgan");
    expect(url.searchParams.get("SortBy")).toBe("LastName");
    expect(url.searchParams.get("SortOrder")).toBe("desc");
    expect(result.pagination.currentPage).toBe(2);
    expect(result.pagination.pageSize).toBe(25);
    expect(result.pagination.totalCount).toBe(50);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.users).toHaveLength(1);
  });

  it("falls back to body pagination metadata when headers are absent", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            curentPage: 3,
            page: 3,
            pageSize: 10,
            totalCount: 21,
            totalPages: 3,
            users: [],
          },
          { status: 200 },
        ),
      ),
    );

    const result = await getUsers({
      page: 3,
      pageSize: 10,
      sortBy: "Email",
      sortOrder: "asc",
    });

    expect(result.pagination.currentPage).toBe(3);
    expect(result.pagination.totalPages).toBe(3);
    expect(result.pagination.totalCount).toBe(21);
  });

  it("ignores invalid pagination header values", () => {
    const headers = new Headers({
      "X-Pagination-CurrentPage": "two",
      "X-Pagination-PageSize": "10.5",
      "X-Pagination-TotalCount": "40",
    });

    expect(parsePaginationHeaders(headers)).toEqual({
      totalCount: 40,
    });
  });
});
