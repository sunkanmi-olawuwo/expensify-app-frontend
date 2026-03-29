"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { isApiError } from "@/lib/api";
import { getToastErrorMessage, toast } from "@/lib/toast";

import { deleteUser } from "../services/admin-users-service";

import { adminUsersQueryKeyRoot } from "./use-admin-users";

import type { AdminUserListItem } from "../types";

type UseDeleteUserOptions = {
  onComplete?: () => void;
};

function getUserDisplayName(user: AdminUserListItem): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function useDeleteUser(options: UseDeleteUserOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      suppressErrorToast: true,
    },
    mutationFn: async (user: AdminUserListItem) => {
      await deleteUser(user.id);

      return user;
    },
    onError: async (error, user) => {
      const displayName = getUserDisplayName(user);

      if (isApiError(error) && error.isNotFound()) {
        toast.info(`${displayName} was already deleted.`, {
          dedupeKey: `admin-users:delete:not-found:${user.id}`,
        });
        await queryClient.invalidateQueries({
          queryKey: adminUsersQueryKeyRoot,
        });
        options.onComplete?.();

        return;
      }

      if (isApiError(error) && error.isForbidden()) {
        toast.error("You do not have permission to delete users.", {
          dedupeKey: `admin-users:delete:forbidden:${user.id}`,
        });

        return;
      }

      toast.error(getToastErrorMessage(error), {
        dedupeKey: `admin-users:delete:error:${user.id}`,
      });
    },
    onSuccess: async (user) => {
      toast.success(`${getUserDisplayName(user)} was deleted.`, {
        dedupeKey: `admin-users:delete:success:${user.id}`,
      });
      await queryClient.invalidateQueries({
        queryKey: adminUsersQueryKeyRoot,
      });
      options.onComplete?.();
    },
  });
}
