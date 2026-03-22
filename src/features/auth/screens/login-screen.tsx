"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, Input } from "@/ui/base";

import { AuthFormCard } from "../components/auth-form-card";
import {
  authInputClassName,
  neutralAuthPlaceholderMessage,
  publicRoutes,
  validateLogin,
} from "../types";

import type { FieldTouched, LoginValues } from "../types";

type LoginScreenProps = {
  onSubmit?: (values: LoginValues) => Promise<void> | void;
};

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<FieldTouched<LoginValues>>({
    email: false,
    password: false,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const errors = validateLogin(values);

  function updateValue(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: keyof LoginValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({ email: true, password: true });
    setStatusMessage(null);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      return;
    }

    if (onSubmit) {
      await onSubmit(values);
      return;
    }

    setStatusMessage(neutralAuthPlaceholderMessage);
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <AuthFormCard
        description="Step into the editorial workspace. Authentication wiring lands in the next phase, but the entry flow and validation are ready now."
        title="Log in to expensify"
      >
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-label-sm text-muted-foreground" htmlFor="email">
              Email
            </label>
            <Input
              aria-invalid={touched.email && errors.email ? true : undefined}
              className={authInputClassName}
              id="email"
              name="email"
              onBlur={() => markTouched("email")}
              onChange={(event) => updateValue("email", event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={values.email}
            />
            {touched.email && errors.email ? (
              <p className="text-body-md text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="text-label-sm text-muted-foreground"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              aria-invalid={touched.password && errors.password ? true : undefined}
              className={authInputClassName}
              id="password"
              name="password"
              onBlur={() => markTouched("password")}
              onChange={(event) => updateValue("password", event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={values.password}
            />
            {touched.password && errors.password ? (
              <p className="text-body-md text-destructive">{errors.password}</p>
            ) : null}
          </div>

          {statusMessage ? (
            <div className="bg-surface-container-low rounded-2xl px-4 py-3">
              <p className="text-body-md text-muted-foreground">{statusMessage}</p>
            </div>
          ) : null}

          <Button className="h-12 w-full rounded-2xl" type="submit">
            Log In
          </Button>

          <p className="text-body-md text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-medium" href={publicRoutes.signup}>
              Sign up
            </Link>
          </p>
        </form>
      </AuthFormCard>
    </div>
  );
}
