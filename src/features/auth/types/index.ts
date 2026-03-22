import type { Route } from "next";

export type FieldTouched<T extends Record<string, unknown>> = Record<
  keyof T,
  boolean
>;

export type LoginValues = {
  email: string;
  password: string;
};

export type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export type SignupValues = {
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type SignupErrors = Partial<Record<keyof SignupValues, string>>;

export type ForgotPasswordValues = {
  email: string;
};

export type ForgotPasswordErrors = Partial<
  Record<keyof ForgotPasswordValues, string>
>;

export type ResetPasswordValues = {
  confirmPassword: string;
  newPassword: string;
};

export type ResetPasswordErrors = Partial<
  Record<keyof ResetPasswordValues, string>
>;

export type PublicAuthStatus =
  | "logged_out"
  | "password_reset"
  | "registered"
  | "session_expired";

export const authInputClassName =
  "bg-surface-container-low focus-visible:border-primary/20 focus-visible:bg-surface-container-highest focus-visible:ring-primary/20 h-12 rounded-2xl border-transparent px-4 shadow-none focus-visible:ring-4";

export const publicRoutes = {
  dashboard: "/dashboard" as Route,
  forgotPassword: "/forgot-password" as Route,
  home: "/" as Route,
  login: "/login" as Route,
  resetPassword: "/reset-password" as Route,
  signup: "/signup" as Route,
} as const;

const publicAuthStatusMessages: Record<PublicAuthStatus, string> = {
  logged_out: "You have been logged out.",
  password_reset: "Password reset successfully. Please log in with your new password.",
  registered: "Account created successfully. Log in to continue.",
  session_expired: "Your session expired. Please log in again.",
};

export function getPublicAuthStatusMessage(
  status: string | null,
): string | null {
  if (!status || !(status in publicAuthStatusMessages)) {
    return null;
  }

  return publicAuthStatusMessages[status as PublicAuthStatus];
}

export function asPublicAuthStatus(
  status: string | null | undefined,
): PublicAuthStatus | null {
  if (!status || !(status in publicAuthStatusMessages)) {
    return null;
  }

  return status as PublicAuthStatus;
}

export function getEmailError(email: string): string | undefined {
  if (!email.trim()) {
    return "Email is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  return undefined;
}

export function validateLogin(values: LoginValues): LoginErrors {
  return {
    email: getEmailError(values.email),
    password: values.password.trim() ? undefined : "Password is required.",
  };
}

export function validateSignup(values: SignupValues): SignupErrors {
  const confirmPasswordError = !values.confirmPassword.trim()
    ? "Confirm your password."
    : values.password !== values.confirmPassword
      ? "Passwords must match."
      : undefined;

  return {
    confirmPassword: confirmPasswordError,
    email: getEmailError(values.email),
    firstName: values.firstName.trim() ? undefined : "First name is required.",
    lastName: values.lastName.trim() ? undefined : "Last name is required.",
    password: values.password.trim() ? undefined : "Password is required.",
  };
}

export function validateForgotPassword(
  values: ForgotPasswordValues,
): ForgotPasswordErrors {
  return {
    email: getEmailError(values.email),
  };
}

export function validateResetPassword(
  values: ResetPasswordValues,
): ResetPasswordErrors {
  const confirmPasswordError = !values.confirmPassword.trim()
    ? "Confirm your password."
    : values.newPassword !== values.confirmPassword
      ? "Passwords must match."
      : undefined;

  return {
    confirmPassword: confirmPasswordError,
    newPassword: values.newPassword.trim()
      ? undefined
      : "New password is required.",
  };
}
