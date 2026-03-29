import { z } from "zod";

import { httpClient } from "@/lib/api";

import {
  pagedResponseMetadataSchema,
  pagedUsersResponseSchema,
  userListFiltersSchema,
} from "../types";

import type {
  AdminUserListItem,
  PagedResponseMetadata,
  PagedUsersResponse,
  UserListFilters,
} from "../types";

export type AdminUsersListResult = {
  pagination: PagedResponseMetadata;
  users: AdminUserListItem[];
};

const paginationHeaderSchema = z.object({
  currentPage: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

function normalizeOptionalString(value?: string): string | undefined {
  const normalized = value?.trim();

  return normalized ? normalized : undefined;
}

export function normalizeUserListFilters(
  filters: UserListFilters = {},
): UserListFilters {
  const normalized = {
    filterBy: filters.filterBy,
    filterQuery: normalizeOptionalString(filters.filterQuery),
    page: filters.page,
    pageSize: filters.pageSize,
    searchQuery: normalizeOptionalString(filters.searchQuery),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  if (!normalized.filterQuery) {
    normalized.filterBy = undefined;
  }

  return userListFiltersSchema.parse(normalized);
}

function parseHeaderInteger(headers: Headers, name: string): number | undefined {
  const rawValue = headers.get(name);

  if (!rawValue) {
    return undefined;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue)) {
    return undefined;
  }

  return parsedValue;
}

export function parsePaginationHeaders(
  headers: Headers,
): Partial<PagedResponseMetadata> {
  const candidate = {
    currentPage: parseHeaderInteger(headers, "X-Pagination-CurrentPage"),
    pageSize: parseHeaderInteger(headers, "X-Pagination-PageSize"),
    totalCount: parseHeaderInteger(headers, "X-Pagination-TotalCount"),
    totalPages: parseHeaderInteger(headers, "X-Pagination-TotalPages"),
  };

  return paginationHeaderSchema.partial().parse(candidate);
}

function resolvePaginationMetadata(
  bodyPagination: PagedResponseMetadata,
  headers: Headers,
): PagedResponseMetadata {
  const headerPagination = parsePaginationHeaders(headers);

  return pagedResponseMetadataSchema.parse({
    currentPage: headerPagination.currentPage ?? bodyPagination.currentPage,
    page: bodyPagination.page,
    pageSize: headerPagination.pageSize ?? bodyPagination.pageSize,
    totalCount: headerPagination.totalCount ?? bodyPagination.totalCount,
    totalPages: headerPagination.totalPages ?? bodyPagination.totalPages,
  });
}

function createUserListParams(filters: UserListFilters) {
  return {
    FilterBy: filters.filterBy,
    FilterQuery: filters.filterQuery,
    Page: filters.page,
    PageSize: filters.pageSize,
    SearchQuery: filters.searchQuery,
    SortBy: filters.sortBy,
    SortOrder: filters.sortOrder,
  };
}

export async function getUsers(
  filters: UserListFilters = {},
): Promise<AdminUsersListResult> {
  const normalizedFilters = normalizeUserListFilters(filters);
  const { data, response } = await httpClient.getResponse<unknown>("/v1/users", {
    params: createUserListParams(normalizedFilters),
  });
  const parsedResponse = pagedUsersResponseSchema.parse(data) as PagedUsersResponse;

  return {
    pagination: resolvePaginationMetadata(parsedResponse, response.headers),
    users: parsedResponse.users,
  };
}

export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete<void>(`/v1/users/${id}`);
}
