import { httpClient } from "@/lib/api";

import {
  changePasswordRequestSchema,
  forgotPasswordRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
  refreshRequestSchema,
  refreshResponseSchema,
  registerRequestSchema,
  registerResponseSchema,
  resetPasswordRequestSchema,
  userProfileSchema,
} from "./types";

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UserProfile,
} from "./types";

const USERS_BASE_PATH = "/v1/users";

export const authService = {
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await httpClient.post<void>(
      `${USERS_BASE_PATH}/change-password`,
      changePasswordRequestSchema.parse(data),
    );
  },
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await httpClient.post<void>(
      `${USERS_BASE_PATH}/forgot-password`,
      forgotPasswordRequestSchema.parse(data),
      {
        auth: "none",
      },
    );
  },
  async getProfile(): Promise<UserProfile> {
    const response = await httpClient.get<unknown>(`${USERS_BASE_PATH}/profile`);

    return userProfileSchema.parse(response);
  },
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<unknown>(
      `${USERS_BASE_PATH}/login`,
      loginRequestSchema.parse(data),
      {
        auth: "none",
      },
    );

    return loginResponseSchema.parse(response);
  },
  async logout(): Promise<void> {
    await httpClient.post<void>(`${USERS_BASE_PATH}/logout`);
  },
  async refreshTokens(data: RefreshRequest): Promise<RefreshResponse> {
    const response = await httpClient.post<unknown>(
      `${USERS_BASE_PATH}/refresh`,
      refreshRequestSchema.parse(data),
      {
        auth: "none",
        retryOnUnauthorized: false,
      },
    );

    return refreshResponseSchema.parse(response);
  },
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await httpClient.post<unknown>(
      `${USERS_BASE_PATH}/register`,
      registerRequestSchema.parse(data),
      {
        auth: "none",
      },
    );

    return registerResponseSchema.parse(response);
  },
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await httpClient.post<void>(
      `${USERS_BASE_PATH}/reset-password`,
      resetPasswordRequestSchema.parse(data),
      {
        auth: "none",
      },
    );
  },
};
