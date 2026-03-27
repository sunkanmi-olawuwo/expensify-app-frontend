"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

import {
  pauseToast,
  resumeToast,
  toast,
  toastStore,
  type ToastRecord,
  type ToastVariant,
} from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/base";

const toastVariantStyles: Record<ToastVariant, string> = {
  error:
    "border-destructive/15 bg-destructive/10 text-foreground ring-1 ring-inset ring-destructive/15",
  info: "border-primary/12 bg-primary/10 text-foreground ring-1 ring-inset ring-primary/12",
  success:
    "border-secondary/15 bg-secondary/10 text-foreground ring-1 ring-inset ring-secondary/15",
  warning:
    "border-outline-variant/25 bg-surface-container-low text-foreground ring-1 ring-inset ring-outline-variant/20",
};

const toastIconStyles: Record<ToastVariant, string> = {
  error: "text-destructive",
  info: "text-primary",
  success: "text-secondary",
  warning: "text-primary-fixed",
};

const toastIcons: Record<ToastVariant, typeof CheckCircle2> = {
  error: XCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
};

function ToastCard({ toast: toastItem }: { toast: ToastRecord }) {
  const Icon = toastIcons[toastItem.variant];

  const handlePause = useCallback(() => {
    pauseToast(toastItem.id);
  }, [toastItem.id]);

  const handleResume = useCallback(() => {
    resumeToast(toastItem.id);
  }, [toastItem.id]);

  function handleActionClick() {
    toastItem.action?.onClick();
    toast.dismiss(toastItem.id);
  }

  return (
    <div
      className={cn(
        "pointer-events-auto rounded-[1.4rem] border p-4 shadow-ambient-md backdrop-blur-xl transition-all",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 sm:data-[state=closed]:slide-out-to-bottom-2",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2 sm:data-[state=open]:slide-in-from-bottom-2",
        "data-[state=closed]:duration-150 data-[state=open]:duration-200",
        toastVariantStyles[toastItem.variant],
      )}
      data-state={toastItem.isExiting ? "closed" : "open"}
      onBlur={handleResume}
      onFocus={handlePause}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface/70",
            toastIconStyles[toastItem.variant],
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-body-md pr-4">{toastItem.message}</p>

          {toastItem.action ? (
            <Button
              className="h-8 rounded-full px-3"
              onClick={handleActionClick}
              size="sm"
              type="button"
              variant="ghost"
            >
              {toastItem.action.label}
            </Button>
          ) : null}
        </div>

        <Button
          aria-label={`Dismiss: ${toastItem.message}`}
          className="mt-[-0.25rem] mr-[-0.4rem] shrink-0 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => toast.dismiss(toastItem.id)}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ToastProvider() {
  const activeToasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );

  const errorToasts = activeToasts.filter((t) => t.variant === "error");
  const politeToasts = activeToasts.filter((t) => t.variant !== "error");

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-3 sm:inset-x-auto sm:right-4 sm:top-auto sm:bottom-4 sm:w-full sm:max-w-[400px]"
      data-desktop-position="bottom-right"
      data-mobile-position="top"
    >
      <div aria-atomic="true" aria-live="assertive" aria-relevant="additions removals">
        {errorToasts.map((toastItem) => (
          <ToastCard key={toastItem.id} toast={toastItem} />
        ))}
      </div>
      <div aria-atomic="true" aria-live="polite" aria-relevant="additions removals">
        {politeToasts.map((toastItem) => (
          <ToastCard key={toastItem.id} toast={toastItem} />
        ))}
      </div>
    </div>
  );
}
