"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "@/lib/toast";
import { Button, Input } from "@/ui/base";

import { AuthFormCard } from "../components/auth-form-card";
import {
  asPublicAuthStatus,
  type FieldTouched,
  type LoginValues,
  type PublicAuthStatus,
  authInputClassName,
  getPublicAuthStatusMessage,
  publicRoutes,
  validateLogin,
} from "../types";

type LoginScreenProps = {
  status?: PublicAuthStatus | null;
};

export function LoginScreen({ status = null }: LoginScreenProps) {
  const { login } = useAuth();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<FieldTouched<LoginValues>>({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validateLogin(values);
  const authStatus = asPublicAuthStatus(status);
  const searchStatusMessage = getPublicAuthStatusMessage(authStatus);

  useEffect(() => {
    if (!authStatus || !searchStatusMessage) {
      return;
    }

    if (authStatus === "session_expired") {
      toast.info(searchStatusMessage, {
        dedupeKey: `auth-status:${authStatus}`,
      });
      return;
    }

    toast.success(searchStatusMessage, {
      dedupeKey: `auth-status:${authStatus}`,
    });
  }, [authStatus, searchStatusMessage]);

  function updateValue(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: keyof LoginValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({ email: true, password: true });

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
    } catch (error) {
      const message = isApiError(error)
        ? error.detail ?? error.message
        : "Unable to log in right now. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <AuthFormCard
        description="Step back into your workspace with your verified account session."
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

          <div className="flex justify-end">
            <Link
              className="text-body-md text-primary font-medium"
              href={publicRoutes.forgotPassword}
            >
              Forgot password?
            </Link>
          </div>

          <Button className="h-12 w-full rounded-2xl" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Logging In..." : "Log In"}
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
