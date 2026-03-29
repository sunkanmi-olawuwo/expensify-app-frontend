"use client";

import { useState } from "react";

import { useDebouncedValue } from "@/lib/hooks";
import { PageHeader } from "@/ui/composite";

import { AdminSubNav } from "../components/admin-sub-nav";
import { UserDeleteDialog } from "../components/user-delete-dialog";
import { UsersTable } from "../components/users-table";
import { UsersTableToolbar } from "../components/users-table-toolbar";

import type { RoleFilterValue } from "../components/users-table-toolbar";
import { useAdminUsers } from "../hooks/use-admin-users";
import { useDeleteUser } from "../hooks/use-delete-user";

import type {
  AdminUserListItem,
  PagedResponseMetadata,
  UserListFilters,
} from "../types";

const defaultPagination: PagedResponseMetadata = {
  currentPage: 1,
  page: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
};

export function AdminUsersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] =
    useState<NonNullable<UserListFilters["sortBy"]>>("Email");
  const [sortOrder, setSortOrder] =
    useState<NonNullable<UserListFilters["sortOrder"]>>("asc");
  const [roleFilter, setRoleFilter] = useState<RoleFilterValue>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(
    null,
  );
  const debouncedSearchQuery = useDebouncedValue(searchQuery);

  const filters: UserListFilters = {
    filterBy: roleFilter === "all" ? undefined : "role",
    filterQuery: roleFilter === "all" ? undefined : roleFilter,
    page,
    pageSize: 10,
    searchQuery: debouncedSearchQuery,
    sortBy,
    sortOrder,
  };

  const usersQuery = useAdminUsers(filters);
  const deleteUserMutation = useDeleteUser({
    onComplete: () => setSelectedUser(null),
  });
  const pagination = usersQuery.data?.pagination ?? defaultPagination;
  const users = usersQuery.data?.users ?? [];

  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="Review the user directory, filter the account roster, and remove users only after an explicit confirmation step."
import { PageHeader } from "@/ui/composite";

import { AdminPlaceholder } from "../components/admin-placeholder";
import { AdminSubNav } from "../components/admin-sub-nav";

export function AdminUsersScreen() {
  return (
    <div className="space-y-8 py-4 sm:py-6">
      <PageHeader
        description="This workspace is wired for admin-only access and ready for the user directory, filters, and moderation actions to land next."
        eyebrow="Administration"
        title="User Management"
      />

      <AdminSubNav />

      <UsersTableToolbar
        onClearSearch={() => {
          setSearchQuery("");
          setPage(1);
        }}
        onRoleFilterChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}
        onSearchQueryChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onSortByChange={(value) => {
          setSortBy(value);
          setPage(1);
        }}
        onToggleSortOrder={() => {
          setSortOrder((currentValue) =>
            currentValue === "asc" ? "desc" : "asc",
          );
          setPage(1);
        }}
        roleFilter={roleFilter}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      <UsersTable
        isFetching={usersQuery.isFetching}
        isLoading={usersQuery.isLoading}
        onDeleteUser={setSelectedUser}
        onPageChange={setPage}
        pagination={pagination}
        pendingDeleteUserId={deleteUserMutation.variables?.id}
        users={users}
      />

      <UserDeleteDialog
        isPending={deleteUserMutation.isPending}
        onClose={() => setSelectedUser(null)}
        onConfirm={() => {
          if (selectedUser) {
            deleteUserMutation.mutate(selectedUser);
          }
        }}
        user={selectedUser}
      />
    </div>
  );
}
