"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/base";

import type { AdminUserListItem } from "../types";

type UserDeleteDialogProps = {
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: AdminUserListItem | null;
};

function getUserName(user: AdminUserListItem) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function UserDeleteDialog({
  isPending,
  onClose,
  onConfirm,
  user,
}: UserDeleteDialogProps) {
  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose();
        }
      }}
      open={Boolean(user)}
    >
      {user ? (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user</AlertDialogTitle>
            <AlertDialogDescription>
              Delete {getUserName(user)} ({user.email}) from the workspace. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              aria-label={isPending ? "Deletion in progress" : `Confirm delete ${getUserName(user)}`}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                onConfirm();
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  );
}
