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
  name: string;
  password: string;
};

export type SignupErrors = Partial<Record<keyof SignupValues, string>>;

export const authInputClassName =
  "bg-surface-container-low focus-visible:border-primary/20 focus-visible:bg-surface-container-highest focus-visible:ring-primary/20 h-12 rounded-2xl border-transparent px-4 shadow-none focus-visible:ring-4";

export const neutralAuthPlaceholderMessage =
  "Auth wiring is not available yet. This form is ready for backend integration.";

export const publicRoutes = {
  home: "/" as Route,
  login: "/login" as Route,
  signup: "/signup" as Route,
} as const;

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
    name: values.name.trim() ? undefined : "Name is required.",
    password: values.password.trim() ? undefined : "Password is required.",
  };
}
