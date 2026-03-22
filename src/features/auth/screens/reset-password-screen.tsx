"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { isApiError } from "@/lib/api";
import { authService } from "@/lib/auth";
import { Button, Input } from "@/ui/base";

import { AuthFeedbackBanner } from "../components/auth-feedback-banner";
import { AuthFormCard } from "../components/auth-form-card";
import {
  authInputClassName,
  publicRoutes,
  validateResetPassword,
} from "../types";

import type { FieldTouched, ResetPasswordValues } from "../types";

type ResetPasswordScreenProps = {
  email?: string | null;
  token?: string | null;
};

export function ResetPasswordScreen({
  email = null,
  token = null,
}: ResetPasswordScreenProps) {
  const router = useRouter();
  const [values, setValues] = useState<ResetPasswordValues>({
    confirmPassword: "",
    newPassword: "",
  });
  const [touched, setTouched] = useState<FieldTouched<ResetPasswordValues>>({
    confirmPassword: false,
    newPassword: false,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validateResetPassword(values);
  const hasValidLink = Boolean(email && token);

  function updateValue(field: keyof ResetPasswordValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: keyof ResetPasswordValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({ confirmPassword: true, newPassword: true });
    setStatusMessage(null);

    const hasErrors = Object.values(errors).some(Boolean);

    if (hasErrors || !email || !token) {
      setStatusMessage("Invalid or expired reset link.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword({
        email,
        newPassword: values.newPassword,
        token,
      });
      router.replace("/login?status=password_reset");
    } catch (error) {
      if (isApiError(error) && error.isValidationError()) {
        setStatusMessage("Invalid or expired reset link.");
      } else if (isApiError(error)) {
        setStatusMessage(error.detail ?? error.message);
      } else {
        setStatusMessage("Unable to reset your password right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center py-6">
      <AuthFormCard
        description="Create a new password for your account using the reset link from your email."
        title="Reset your password"
      >
        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          {!hasValidLink ? (
            <AuthFeedbackBanner tone="error">
              Invalid or expired reset link.
            </AuthFeedbackBanner>
          ) : null}

          {statusMessage ? (
            <AuthFeedbackBanner tone="error">{statusMessage}</AuthFeedbackBanner>
          ) : null}

          <div className="space-y-2">
            <label
              className="text-label-sm text-muted-foreground"
              htmlFor="new-password"
            >
              New Password
            </label>
            <Input
              aria-invalid={touched.newPassword && errors.newPassword ? true : undefined}
              className={authInputClassName}
              id="new-password"
              name="newPassword"
              onBlur={() => markTouched("newPassword")}
              onChange={(event) => updateValue("newPassword", event.target.value)}
              placeholder="Create a new password"
              type="password"
              value={values.newPassword}
            />
            {touched.newPassword && errors.newPassword ? (
              <p className="text-body-md text-destructive">{errors.newPassword}</p>
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
              placeholder="Repeat your new password"
              type="password"
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword ? (
              <p className="text-body-md text-destructive">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <Button
            className="h-12 w-full rounded-2xl"
            disabled={isSubmitting || !hasValidLink}
            type="submit"
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
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
