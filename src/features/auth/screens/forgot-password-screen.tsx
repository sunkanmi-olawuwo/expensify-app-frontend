"use client";

import Link from "next/link";
import { useState } from "react";

import { isApiError } from "@/lib/api";
import { authService } from "@/lib/auth";
import { toast } from "@/lib/toast";
import { Button, Input } from "@/ui/base";

import { AuthFormCard } from "../components/auth-form-card";
import {
  authInputClassName,
  publicRoutes,
  validateForgotPassword,
} from "../types";

import type { FieldTouched, ForgotPasswordValues } from "../types";

export function ForgotPasswordScreen() {
  const [values, setValues] = useState<ForgotPasswordValues>({ email: "" });
  const [touched, setTouched] = useState<FieldTouched<ForgotPasswordValues>>({
    email: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validateForgotPassword(values);

  function updateValue(value: string) {
    setValues({ email: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({ email: true });

    if (errors.email) {
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword(values);
      toast.success("Check your email for a reset link.", {
        dedupeKey: "forgot-password:success",
      });
    } catch (error) {
      const message = isApiError(error)
        ? error.detail ?? error.message
        : "Unable to send a reset link right now. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <AuthFormCard
        description="We'll send a password reset link to the email on your account."
        title="Forgot your password?"
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
              onBlur={() => setTouched({ email: true })}
              onChange={(event) => updateValue(event.target.value)}
              placeholder="name@company.com"
              type="email"
              value={values.email}
            />
            {touched.email && errors.email ? (
              <p className="text-body-md text-destructive">{errors.email}</p>
            ) : null}
          </div>

          <Button className="h-12 w-full rounded-2xl" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>

          <p className="text-body-md text-muted-foreground text-center">
            <Link className="text-primary font-medium" href={publicRoutes.login}>
              Back to Log In
            </Link>
          </p>
        </form>
      </AuthFormCard>
    </div>
  );
}
