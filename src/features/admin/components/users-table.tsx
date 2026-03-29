"use client";

import { ChevronLeft, ChevronRight, LoaderCircle, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import type { AdminUserListItem, PagedResponseMetadata } from "../types";

type UsersTableProps = {
  isFetching?: boolean;
  isLoading: boolean;
  onDeleteUser: (user: AdminUserListItem) => void;
  onPageChange: (page: number) => void;
  pagination: PagedResponseMetadata;
  pendingDeleteUserId?: string;
  users: AdminUserListItem[];
};

function getUserName(user: AdminUserListItem) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr aria-hidden="true" key={`users-loading-${index}`} className="bg-surface">
          <td className="rounded-l-[1.4rem] px-4 py-4">
            <div className="bg-surface-container-high h-5 w-36 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="bg-surface-container-high h-5 w-44 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <div className="bg-surface-container-high h-5 w-16 rounded-full" />
          </td>
          <td className="rounded-r-[1.4rem] px-4 py-4">
            <div className="bg-surface-container-high ml-auto h-9 w-9 rounded-full" />
          </td>
        </tr>
      ))}
    </>
  );
}

function MobileLoadingCards() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          aria-hidden="true"
          key={`users-mobile-loading-${index}`}
          className="bg-surface rounded-[1.4rem] p-4"
        >
          <div className="space-y-3">
            <div className="bg-surface-container-high h-5 w-40 rounded-full" />
            <div className="bg-surface-container-high h-4 w-48 rounded-full" />
            <div className="bg-surface-container-high h-4 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

export function UsersTable({
  isFetching = false,
  isLoading,
  onDeleteUser,
  onPageChange,
  pagination,
  pendingDeleteUserId,
  users,
}: UsersTableProps) {
  const canGoBack = pagination.currentPage > 1;
  const canGoForward = pagination.currentPage < pagination.totalPages;

  const statusMessage = isLoading
    ? "Loading users…"
    : users.length === 0
      ? "No users match the current filters."
      : `${pagination.totalCount} user${pagination.totalCount === 1 ? "" : "s"} loaded.`;

  return (
    <SurfaceCard
      action={
        isFetching && !isLoading ? (
          <div
            aria-live="polite"
            aria-atomic="true"
            className="text-muted-foreground inline-flex items-center gap-2 text-sm"
          >
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            <span>Refreshing</span>
          </div>
        ) : null
      }
      className="bg-surface-container-low p-4 sm:p-5"
      title="Directory"
      tone="subtle"
    >
      <div className="space-y-4">
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {statusMessage}
        </p>

        <div className="space-y-3 md:hidden">
          {isLoading ? <MobileLoadingCards /> : null}

          {!isLoading && users.length === 0 ? (
            <div className="bg-surface text-muted-foreground rounded-[1.4rem] px-4 py-8 text-center">
              No users match the current filters.
            </div>
          ) : null}

          {!isLoading
            ? users.map((user) => {
                const isDeletePending = pendingDeleteUserId === user.id;

                return (
                  <article
                    key={user.id}
                    className="bg-surface hover:bg-surface-container-low relative rounded-[1.4rem] p-4 transition-colors"
                  >
                    <Link
                      aria-label={`View profile for ${getUserName(user)}`}
                      className="block w-full text-left"
                      href={`/admin/users/${user.id}`}
                    >
                      <p className="text-body-md text-foreground font-semibold">
                        {getUserName(user)}
                      </p>
                      <p className="text-body-md text-muted-foreground mt-1">
                        {user.email}
                      </p>
                      <p className="text-label-sm text-muted-foreground mt-3">
                        {user.role}
                      </p>
                    </Link>

                    <div className="mt-4 flex justify-end">
                      <Button
                        aria-label={`Delete ${getUserName(user)}`}
                        disabled={isDeletePending}
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteUser(user);
                        }}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        {isDeletePending ? (
                          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                        ) : (
                          <Trash2 aria-hidden="true" className="size-4" />
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })
            : null}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table
            aria-busy={isLoading}
            aria-label="User directory"
            className="min-w-full border-separate border-spacing-y-3"
          >
            <thead>
              <tr className="text-label-sm text-muted-foreground text-left">
                <th scope="col" className="px-4 py-2">Name</th>
                <th scope="col" className="px-4 py-2">Email</th>
                <th scope="col" className="px-4 py-2">Role</th>
                <th scope="col" className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <LoadingRows /> : null}

              {!isLoading && users.length === 0 ? (
                <tr className="bg-surface">
                  <td
                    className="text-muted-foreground rounded-[1.4rem] px-4 py-8 text-center"
                    colSpan={4}
                  >
                    No users match the current filters.
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? users.map((user) => {
                    const isDeletePending = pendingDeleteUserId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="bg-surface hover:bg-surface-container-low transition-colors"
                      >
                        <td className="text-body-md text-foreground relative rounded-l-[1.4rem] px-4 py-4 font-semibold">
                          <Link
                            className="after:absolute after:inset-0 after:rounded-[1.4rem]"
                            href={`/admin/users/${user.id}`}
                          >
                            {getUserName(user)}
                          </Link>
                        </td>
                        <td className="text-body-md text-muted-foreground px-4 py-4">
                          {user.email}
                        </td>
                        <td className="text-body-md text-foreground px-4 py-4">
                          {user.role}
                        </td>
                        <td className="relative rounded-r-[1.4rem] px-4 py-4 text-right">
                          <Button
                            aria-label={`Delete ${getUserName(user)}`}
                            className="text-muted-foreground hover:text-foreground relative z-10"
                            disabled={isDeletePending}
                            onClick={() => onDeleteUser(user)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            {isDeletePending ? (
                              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                            ) : (
                              <Trash2 aria-hidden="true" className="size-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>

        <nav aria-label="User directory pagination" className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" aria-atomic="true" className="text-body-md text-muted-foreground">
            Page {pagination.currentPage} of {Math.max(1, pagination.totalPages)}
            {" · "}
            {pagination.pageSize} per page
          </p>

          <div className="flex items-center gap-2">
            <Button
              aria-label={canGoBack ? `Go to page ${pagination.currentPage - 1}` : "Previous page"}
              disabled={!canGoBack || isLoading}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              type="button"
              variant="outline"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Previous
            </Button>
            <Button
              aria-label={canGoForward ? `Go to page ${pagination.currentPage + 1}` : "Next page"}
              disabled={!canGoForward || isLoading}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              type="button"
              variant="outline"
            >
              Next
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </nav>
      </div>
    </SurfaceCard>
  );
}
