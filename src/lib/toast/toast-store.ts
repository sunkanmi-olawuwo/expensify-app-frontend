export type ToastVariant = "error" | "info" | "success" | "warning";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastInput = {
  action?: ToastAction;
  dedupeKey?: string;
  duration?: number | null;
  message: string;
  variant: ToastVariant;
};

export type ToastRecord = ToastInput & {
  createdAt: number;
  dedupeKey: string;
  duration: number | null;
  id: string;
  isExiting: boolean;
};

type ToastStoreListener = () => void;

const DEFAULT_DURATION_MS = 5_000;
const EXIT_DURATION_MS = 180;
const MAX_TOASTS = 5;

let nextToastId = 0;
let toastState: ToastRecord[] = [];

const listeners = new Set<ToastStoreListener>();
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
const removalTimers = new Map<string, ReturnType<typeof setTimeout>>();
const pausedToasts = new Set<string>();
const remainingDurations = new Map<string, number>();
const timerStartTimes = new Map<string, number>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function clearTimer(
  timerMap: Map<string, ReturnType<typeof setTimeout>>,
  toastId: string,
) {
  const timer = timerMap.get(toastId);

  if (!timer) {
    return;
  }

  clearTimeout(timer);
  timerMap.delete(toastId);
}

function removeToastImmediately(toastId: string) {
  clearTimer(dismissTimers, toastId);
  clearTimer(removalTimers, toastId);
  pausedToasts.delete(toastId);
  remainingDurations.delete(toastId);
  timerStartTimes.delete(toastId);
  toastState = toastState.filter((toast) => toast.id !== toastId);
  emitChange();
}

function startRemoval(toastId: string) {
  clearTimer(removalTimers, toastId);
  removalTimers.set(
    toastId,
    setTimeout(() => {
      removeToastImmediately(toastId);
    }, EXIT_DURATION_MS),
  );
}

function resolveToastDuration(input: ToastInput): number | null {
  if (input.duration !== undefined) {
    return input.duration;
  }

  return input.variant === "error" ? null : DEFAULT_DURATION_MS;
}

function resolveDedupeKey(input: ToastInput): string {
  return input.dedupeKey ?? `${input.variant}:${input.message}`;
}

function scheduleDismiss(toastRecord: ToastRecord, duration?: number) {
  clearTimer(dismissTimers, toastRecord.id);

  const effectiveDuration = duration ?? toastRecord.duration;

  if (effectiveDuration === null || effectiveDuration <= 0) {
    return;
  }

  timerStartTimes.set(toastRecord.id, Date.now());
  remainingDurations.set(toastRecord.id, effectiveDuration);

  dismissTimers.set(
    toastRecord.id,
    setTimeout(() => {
      dismissToast(toastRecord.id);
    }, effectiveDuration),
  );
}

export function pauseToast(toastId: string) {
  const existing = toastState.find((t) => t.id === toastId);

  if (!existing || existing.isExiting || pausedToasts.has(toastId)) {
    return;
  }

  pausedToasts.add(toastId);

  const startTime = timerStartTimes.get(toastId);
  const remaining = remainingDurations.get(toastId);

  if (startTime !== undefined && remaining !== undefined) {
    const elapsed = Date.now() - startTime;
    remainingDurations.set(toastId, Math.max(0, remaining - elapsed));
  }

  clearTimer(dismissTimers, toastId);
}

export function resumeToast(toastId: string) {
  if (!pausedToasts.has(toastId)) {
    return;
  }

  pausedToasts.delete(toastId);

  const existing = toastState.find((t) => t.id === toastId);

  if (!existing || existing.isExiting) {
    return;
  }

  const remaining = remainingDurations.get(toastId);

  if (remaining !== undefined && remaining > 0) {
    scheduleDismiss(existing, remaining);
  }
}

export function dismissToast(toastId: string) {
  const existingToast = toastState.find((toast) => toast.id === toastId);

  if (!existingToast || existingToast.isExiting) {
    return;
  }

  clearTimer(dismissTimers, toastId);
  pausedToasts.delete(toastId);
  remainingDurations.delete(toastId);
  timerStartTimes.delete(toastId);
  toastState = toastState.map((toast) =>
    toast.id === toastId ? { ...toast, isExiting: true } : toast,
  );
  emitChange();
  startRemoval(toastId);
}

export function dismissAllToasts() {
  toastState.forEach((toast) => {
    dismissToast(toast.id);
  });
}

export function showToast(input: ToastInput): string {
  const dedupeKey = resolveDedupeKey(input);
  const existingToast = toastState.find((toast) => toast.dedupeKey === dedupeKey);

  if (existingToast) {
    return existingToast.id;
  }

  while (toastState.filter((t) => !t.isExiting).length >= MAX_TOASTS) {
    const oldest = toastState.find((t) => !t.isExiting);

    if (oldest) {
      dismissToast(oldest.id);
    }
  }

  const toastRecord: ToastRecord = {
    ...input,
    createdAt: Date.now(),
    dedupeKey,
    duration: resolveToastDuration(input),
    id: `toast-${++nextToastId}`,
    isExiting: false,
  };

  toastState = [...toastState, toastRecord];
  emitChange();
  scheduleDismiss(toastRecord);

  return toastRecord.id;
}

export const toastStore = {
  getSnapshot: () => toastState,
  subscribe(listener: ToastStoreListener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

export function resetToastState() {
  dismissTimers.forEach((_, toastId) => clearTimer(dismissTimers, toastId));
  removalTimers.forEach((_, toastId) => clearTimer(removalTimers, toastId));
  pausedToasts.clear();
  remainingDurations.clear();
  timerStartTimes.clear();
  nextToastId = 0;
  toastState = [];
  emitChange();
}

export const toast = {
  dismiss(toastId?: string) {
    if (!toastId) {
      dismissAllToasts();
      return;
    }

    dismissToast(toastId);
  },
  dismissAll() {
    dismissAllToasts();
  },
  error(message: string, options: Omit<ToastInput, "message" | "variant"> = {}) {
    return showToast({ ...options, message, variant: "error" });
  },
  info(message: string, options: Omit<ToastInput, "message" | "variant"> = {}) {
    return showToast({ ...options, message, variant: "info" });
  },
  show(input: ToastInput) {
    return showToast(input);
  },
  success(
    message: string,
    options: Omit<ToastInput, "message" | "variant"> = {},
  ) {
    return showToast({ ...options, message, variant: "success" });
  },
  warning(
    message: string,
    options: Omit<ToastInput, "message" | "variant"> = {},
  ) {
    return showToast({ ...options, message, variant: "warning" });
  },
};
