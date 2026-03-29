"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getUsers,
  normalizeUserListFilters,
} from "../services/admin-users-service";

import type { UserListFilters } from "../types";

export const adminUsersQueryKeyRoot = ["admin", "users"] as const;

export function adminUsersQueryKey(filters: UserListFilters = {}) {
  return [
    ...adminUsersQueryKeyRoot,
    "list",
    normalizeUserListFilters(filters),
  ] as const;
}

export function useAdminUsers(filters: UserListFilters = {}) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getUsers(filters),
    queryKey: adminUsersQueryKey(filters),
  });
}
