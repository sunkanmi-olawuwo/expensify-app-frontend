"use client";

import { ArrowDownAZ, Search, X } from "lucide-react";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/base";
import { SurfaceCard } from "@/ui/composite";

import type { UserListFilters } from "../types";

export type RoleFilterValue = "Admin" | "User" | "all";

type UsersTableToolbarProps = {
  onClearSearch: () => void;
  onRoleFilterChange: (value: RoleFilterValue) => void;
  onSearchQueryChange: (value: string) => void;
  onSortByChange: (value: NonNullable<UserListFilters["sortBy"]>) => void;
  onToggleSortOrder: () => void;
  roleFilter: RoleFilterValue;
  searchQuery: string;
  sortBy: NonNullable<UserListFilters["sortBy"]>;
  sortOrder: NonNullable<UserListFilters["sortOrder"]>;
};

const sortOptions: Array<NonNullable<UserListFilters["sortBy"]>> = [
  "Email",
  "FirstName",
  "LastName",
  "Role",
];

const roleOptions: RoleFilterValue[] = ["all", "Admin", "User"];

function formatSortLabel(value: NonNullable<UserListFilters["sortBy"]>) {
  switch (value) {
    case "FirstName":
      return "First Name";
    case "LastName":
      return "Last Name";
    default:
      return value;
  }
}

function formatRoleLabel(value: RoleFilterValue) {
  return value === "all" ? "All Roles" : value;
}

export function UsersTableToolbar({
  onClearSearch,
  onRoleFilterChange,
  onSearchQueryChange,
  onSortByChange,
  onToggleSortOrder,
  roleFilter,
  searchQuery,
  sortBy,
  sortOrder,
}: UsersTableToolbarProps) {
  return (
    <SurfaceCard
      className="bg-surface-container-low p-4 sm:p-5"
      description="Search the directory, reorder the list, and narrow the results before opening a user workspace."
      tone="subtle"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(12rem,0.75fr)_auto]">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            aria-label="Search users"
            className="bg-surface focus-visible:border-primary/20 focus-visible:ring-primary/10 h-11 rounded-full border-transparent pr-12 pl-10 shadow-ambient-sm focus-visible:ring-4"
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search by name or email..."
            value={searchQuery}
          />
          {searchQuery ? (
            <Button
              aria-label="Clear user search"
              className="absolute top-1/2 right-1.5 -translate-y-1/2"
              onClick={onClearSearch}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Select onValueChange={onSortByChange} value={sortBy}>
            <SelectTrigger aria-label="Sort users">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatSortLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => onRoleFilterChange(value as RoleFilterValue)}
            value={roleFilter}
          >
            <SelectTrigger aria-label="Filter users by role">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatRoleLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          aria-label={sortOrder === "asc" ? "Switch to descending order" : "Switch to ascending order"}
          aria-pressed={sortOrder === "desc"}
          className="h-11 rounded-full px-4"
          onClick={onToggleSortOrder}
          type="button"
          variant="outline"
        >
          <ArrowDownAZ className="size-4" />
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>
    </SurfaceCard>
  );
}
