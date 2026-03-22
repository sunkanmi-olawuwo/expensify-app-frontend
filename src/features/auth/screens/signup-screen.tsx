"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, Input } from "@/ui/base";

import { AuthFormCard } from "../components/auth-form-card";
import {
  authInputClassName,
  neutralAuthPlaceholderMessage,
  publicRoutes,
  validateSignup,
} from "../types";

import type { FieldTouched, SignupValues } from "../types";

type SignupScreenProps = {
  onSubmit?: (values: SignupValues) => Promise<void> | void;
};

export function SignupScreen({ onSubmit }: SignupScreenProps) {
  const [values, setValues] = useState<SignupValues>({
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
  });
  const [touched, setTouched] = useState<FieldTouched<SignupValues>>({
    confirmPassword: false,
    email: false,
    name: false,
    password: false,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const errors = validateSignup(values);

  function updateValue(field: keyof SignupValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: keyof SignupValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({
      confirmPassword: true,
      email: true,
      name: true,
      password: true,
    });
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
        description="Establish the first-run account surface now, then connect it to the backend auth flow in the next implementation phase."
        title="Create your expensify account"
      >
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-label-sm text-muted-foreground" htmlFor="name">
              Name
            </label>
            <Input
              aria-invalid={touched.name && errors.name ? true : undefined}
              className={authInputClassName}
              id="name"
              name="name"
              onBlur={() => markTouched("name")}
              onChange={(event) => updateValue("name", event.target.value)}
              placeholder="Morgan Lee"
              value={values.name}
            />
            {touched.name && errors.name ? (
              <p className="text-body-md text-destructive">{errors.name}</p>
            ) : null}
          </div>

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
              placeholder="Create a password"
              type="password"
              value={values.password}
            />
            {touched.password && errors.password ? (
              <p className="text-body-md text-destructive">{errors.password}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="text-label-sm text-muted-foreground"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <Input
              aria-invalid={
                touched.confirmPassword && errors.confirmPassword ? true : undefined
              }
              className={authInputClassName}
              id="confirm-password"
              name="confirm-password"
              onBlur={() => markTouched("confirmPassword")}
              onChange={(event) =>
                updateValue("confirmPassword", event.target.value)
              }
              placeholder="Repeat your password"
              type="password"
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <p className="text-body-md text-destructive">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          {statusMessage ? (
            <div className="bg-surface-container-low rounded-2xl px-4 py-3">
              <p className="text-body-md text-muted-foreground">{statusMessage}</p>
            </div>
          ) : null}

          <Button className="h-12 w-full rounded-2xl" type="submit">
            Sign Up
          </Button>

          <p className="text-body-md text-muted-foreground text-center">
            Already have an account?{" "}
            <Link className="text-primary font-medium" href={publicRoutes.login}>
              Log in
            </Link>
          </p>
        </form>
      </AuthFormCard>
    </div>
  );
}
