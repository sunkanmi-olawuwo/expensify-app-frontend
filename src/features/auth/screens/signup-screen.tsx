"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Input } from "@/ui/base";

import { AuthFeedbackBanner } from "../components/auth-feedback-banner";
import { AuthFormCard } from "../components/auth-form-card";
import { authInputClassName, publicRoutes, validateSignup } from "../types";

import type { FieldTouched, SignupValues } from "../types";

export function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState<SignupValues>({
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [touched, setTouched] = useState<FieldTouched<SignupValues>>({
    confirmPassword: false,
    email: false,
    firstName: false,
    lastName: false,
    password: false,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      firstName: true,
      lastName: true,
      password: true,
    });
    setStatusMessage(null);

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
      );
      router.push("/login?status=registered");
    } catch (error) {
      if (isApiError(error) && error.isConflict()) {
        setStatusMessage("An account with this email already exists.");
      } else if (isApiError(error)) {
        setStatusMessage(error.detail ?? error.message);
      } else {
        setStatusMessage("Unable to create your account right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <AuthFormCard
        description="Create your account to start tracking money inside the editorial workspace."
        title="Create your expensify account"
      >
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          {statusMessage ? (
            <AuthFeedbackBanner tone="error">{statusMessage}</AuthFeedbackBanner>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-label-sm text-muted-foreground"
                htmlFor="first-name"
              >
                First Name
              </label>
              <Input
                aria-invalid={
                  touched.firstName && errors.firstName ? true : undefined
                }
                className={authInputClassName}
                id="first-name"
                name="firstName"
                onBlur={() => markTouched("firstName")}
                onChange={(event) => updateValue("firstName", event.target.value)}
                placeholder="Morgan"
                value={values.firstName}
              />
              {touched.firstName && errors.firstName ? (
                <p className="text-body-md text-destructive">{errors.firstName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                className="text-label-sm text-muted-foreground"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <Input
                aria-invalid={touched.lastName && errors.lastName ? true : undefined}
                className={authInputClassName}
                id="last-name"
                name="lastName"
                onBlur={() => markTouched("lastName")}
                onChange={(event) => updateValue("lastName", event.target.value)}
                placeholder="Lee"
                value={values.lastName}
              />
              {touched.lastName && errors.lastName ? (
                <p className="text-body-md text-destructive">{errors.lastName}</p>
              ) : null}
            </div>
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
              name="confirmPassword"
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

          <Button className="h-12 w-full rounded-2xl" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating Account..." : "Sign Up"}
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
