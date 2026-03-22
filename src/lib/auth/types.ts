import { z } from "zod";

export const DEFAULT_SIGNUP_ROLE = "User" as const;

export const registerRequestSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  password: z.string().min(1),
  role: z.string().trim().min(1),
});

export const registerResponseSchema = z.object({
  userId: z.string().min(1),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
  refreshToken: z.string().min(1),
  token: z.string().min(1),
});

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
  token: z.string().min(1),
});

export const refreshResponseSchema = loginResponseSchema;

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(1),
  token: z.string().min(1),
});

export const userProfileSchema = z.object({
  currency: z.string().min(1),
  firstName: z.string().min(1),
  id: z.string().min(1),
  lastName: z.string().min(1),
  monthStartDay: z.number().int(),
  timezone: z.string().min(1),
});

export const authUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  id: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
export type ChangePasswordRequest = z.infer<
  typeof changePasswordRequestSchema
>;
export type ForgotPasswordRequest = z.infer<
  typeof forgotPasswordRequestSchema
>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
