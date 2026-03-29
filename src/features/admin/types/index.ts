import { z } from "zod";

import type { ZodArray, ZodTypeAny } from "zod";

const guidSchema = z.string().uuid();
const monthPeriodSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected yyyy-MM period.");
const isoDateSchema = z
  .string()
  .regex(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    "Expected yyyy-MM-dd date.",
  );
const sortOrderSchema = z.enum(["asc", "desc"]);

const pagedResponseBaseSchema = z.object({
  currentPage: z.number().int().nonnegative(),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const pagedResponseMetadataSchema = pagedResponseBaseSchema;

export type PagedResponseMetadata = z.infer<typeof pagedResponseMetadataSchema>;
export type AdminPagedResponse<TItemsKey extends string, TItem> =
  PagedResponseMetadata & Record<TItemsKey, TItem[]>;

function createPagedResponseSchema<
  TItemsKey extends string,
  TItemSchema extends ZodTypeAny,
>(itemsKey: TItemsKey, itemSchema: TItemSchema) {
  const shape = {
    ...pagedResponseBaseSchema.shape,
    [itemsKey]: z.array(itemSchema),
  } as typeof pagedResponseBaseSchema.shape & Record<TItemsKey, ZodArray<TItemSchema>>;

  return z.object(shape);
}

export const adminUserListItemSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  id: guidSchema,
  lastName: z.string().min(1),
  role: z.string().min(1),
});

export const pagedUsersResponseSchema = createPagedResponseSchema(
  "users",
  adminUserListItemSchema,
);

export const currencySchema = z.object({
  code: z.string().min(1),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  minorUnit: z.number().int().min(0),
  name: z.string().min(1),
  sortOrder: z.number().int(),
  symbol: z.string().min(1),
});

export const timezoneSchema = z.object({
  displayName: z.string().min(1),
  ianaId: z.string().min(1),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  sortOrder: z.number().int(),
});

export const expenseListItemSchema = z.object({
  amount: z.number(),
  categoryId: guidSchema,
  categoryName: z.string().min(1),
  currency: z.string().min(1),
  date: isoDateSchema,
  id: guidSchema,
  merchant: z.string().min(1),
  note: z.string(),
  paymentMethod: z.enum([
    "Cash",
    "Card",
    "Transfer",
    "Wallet",
    "Other",
    "DirectDebit",
  ]),
  tagIds: z.array(guidSchema),
  tagNames: z.array(z.string().min(1)),
});

export const pagedExpensesResponseSchema = createPagedResponseSchema(
  "items",
  expenseListItemSchema,
);

export const expenseMonthlySummaryCategorySchema = z.object({
  amount: z.number(),
  categoryId: guidSchema,
  categoryName: z.string().min(1),
});

export const expenseMonthlySummarySchema = z.object({
  categories: z.array(expenseMonthlySummaryCategorySchema),
  expenseCount: z.number().int().nonnegative(),
  period: monthPeriodSchema,
  totalAmount: z.number(),
});

export const incomeListItemSchema = z.object({
  amount: z.number(),
  currency: z.string().min(1),
  date: isoDateSchema,
  id: guidSchema,
  note: z.string(),
  source: z.string().min(1),
  type: z.enum([
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Refund",
    "Other",
  ]),
});

export const pagedIncomeResponseSchema = createPagedResponseSchema(
  "items",
  incomeListItemSchema,
);

export const incomeMonthlySummaryTypeSchema = z.object({
  amount: z.number(),
  type: z.string().min(1),
});

export const incomeMonthlySummarySchema = z.object({
  incomeCount: z.number().int().nonnegative(),
  period: monthPeriodSchema,
  totalAmount: z.number(),
  types: z.array(incomeMonthlySummaryTypeSchema),
});

export const investmentCategorySchema = z.object({
  id: guidSchema,
  isActive: z.boolean(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const investmentAccountListItemSchema = z.object({
  categoryId: guidSchema,
  currency: z.string().min(1),
  currentBalance: z.number(),
  id: guidSchema,
  interestRate: z.number().nullable(),
  maturityDate: isoDateSchema.nullable(),
  name: z.string().min(1),
  notes: z.string().nullable(),
  provider: z.string().nullable(),
  userId: guidSchema,
});

export const userListFiltersSchema = z.object({
  filterBy: z.enum(["role"]).optional(),
  filterQuery: z.string().trim().min(1).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  searchQuery: z.string().trim().min(1).optional(),
  sortBy: z.enum(["Email", "FirstName", "LastName", "Role"]).optional(),
  sortOrder: sortOrderSchema.optional(),
});

export const expenseFiltersSchema = z.object({
  categoryId: guidSchema.optional(),
  maxAmount: z.number().optional(),
  merchant: z.string().trim().min(1).optional(),
  minAmount: z.number().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  paymentMethod: expenseListItemSchema.shape.paymentMethod.optional(),
  period: monthPeriodSchema,
  sortBy: z.enum(["date", "amount", "merchant"]).optional(),
  sortOrder: sortOrderSchema.optional(),
  tagIds: z.array(guidSchema).optional(),
});

export const incomeFiltersSchema = z.object({
  maxAmount: z.number().optional(),
  minAmount: z.number().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
  period: monthPeriodSchema,
  sortBy: z.enum(["date", "amount", "source"]).optional(),
  sortOrder: sortOrderSchema.optional(),
  source: z.string().trim().min(1).optional(),
  type: incomeListItemSchema.shape.type.optional(),
});

export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;
export type PagedUsersResponse = z.infer<typeof pagedUsersResponseSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type Timezone = z.infer<typeof timezoneSchema>;
export type ExpenseListItem = z.infer<typeof expenseListItemSchema>;
export type PagedExpensesResponse = z.infer<typeof pagedExpensesResponseSchema>;
export type ExpenseMonthlySummary = z.infer<typeof expenseMonthlySummarySchema>;
export type IncomeListItem = z.infer<typeof incomeListItemSchema>;
export type PagedIncomeResponse = z.infer<typeof pagedIncomeResponseSchema>;
export type IncomeMonthlySummary = z.infer<typeof incomeMonthlySummarySchema>;
export type InvestmentCategory = z.infer<typeof investmentCategorySchema>;
export type InvestmentAccountListItem = z.infer<
  typeof investmentAccountListItemSchema
>;
export type UserListFilters = z.infer<typeof userListFiltersSchema>;
export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
export type IncomeFilters = z.infer<typeof incomeFiltersSchema>;
