"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

import { getNextTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/base";

import type { LucideIcon } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
  switchStyle?: boolean;
};

const themeConfig: Record<
  "light" | "dark" | "system",
  { icon: LucideIcon; iconClassName: string; label: string }
> = {
  dark: {
    icon: Moon,
    iconClassName: "-rotate-12 scale-100",
    label: "Dark",
  },
  light: {
    icon: Sun,
    iconClassName: "rotate-0 scale-100",
    label: "Light",
  },
  system: {
    icon: Monitor,
    iconClassName: "rotate-6 scale-95",
    label: "System",
  },
};

function subscribeToHydration(): () => void {
  return () => undefined;
}

export function ThemeToggle({
  className,
  compact = false,
  switchStyle = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const renderTheme = mounted ? theme : "system";
  const renderResolvedTheme = mounted ? resolvedTheme : "light";
  const nextTheme = getNextTheme(renderTheme);
  const currentTheme = themeConfig[renderTheme];
  const nextThemeLabel = themeConfig[nextTheme].label;
  const Icon = currentTheme.icon;
  const isDarkEnabled = renderResolvedTheme === "dark";
  const currentLabel =
    renderTheme === "system"
      ? `${currentTheme.label} (${renderResolvedTheme})`
      : currentTheme.label;
  const ariaLabel = `Theme ${currentTheme.label}. Switch to ${nextThemeLabel} theme.`;

  const handleClick = () => {
    setTheme(nextTheme);
    setStatusMessage(`Theme changed to ${themeConfig[nextTheme].label}`);
  };

  if (compact) {
    return (
      <>
        <Button
          aria-label={ariaLabel}
          className={cn(
            "bg-surface text-foreground shadow-ambient-sm size-11 rounded-full hover:bg-surface-container-low",
            className,
          )}
          data-resolved-theme={renderResolvedTheme}
          data-theme={renderTheme}
          onClick={handleClick}
          size="icon-lg"
          suppressHydrationWarning
          type="button"
          variant="ghost"
        >
          <span
            className={cn(
              "transition-transform duration-200 ease-out",
              currentTheme.iconClassName,
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
        </Button>
        <span aria-atomic="true" aria-live="polite" className="sr-only">
          {statusMessage}
        </span>
      </>
    );
  }

  if (switchStyle) {
    const switchLabel = `Dark mode ${isDarkEnabled ? "on" : "off"}.`;

    return (
      <>
        <Button
          aria-checked={isDarkEnabled}
          aria-label={switchLabel}
          className={cn(
            "bg-surface-container-low hover:bg-surface-container flex h-auto w-full items-center justify-between rounded-[1.2rem] px-4 py-3 shadow-none",
            className,
          )}
          data-resolved-theme={renderResolvedTheme}
          data-theme={renderTheme}
          onClick={() => {
            const nextResolvedTheme = isDarkEnabled ? "light" : "dark";

            setTheme(nextResolvedTheme);
            setStatusMessage(`Theme changed to ${themeConfig[nextResolvedTheme].label}`);
          }}
          role="switch"
          suppressHydrationWarning
          type="button"
          variant="ghost"
        >
          <span
            className={cn(
              "bg-surface text-foreground shadow-ambient-sm flex size-10 items-center justify-center rounded-full transition-transform duration-200 ease-out",
              currentTheme.iconClassName,
            )}
          >
            <Icon aria-hidden="true" className="size-4.5" />
          </span>

          <span
            aria-hidden="true"
            className={cn(
              "flex h-7 w-12 items-center rounded-full border border-transparent px-1 transition-colors",
              isDarkEnabled ? "bg-primary/22" : "bg-surface-bright",
            )}
          >
            <span
              className={cn(
                "bg-surface shadow-ambient-sm flex size-5 items-center justify-center rounded-full transition-transform duration-200 ease-out",
                isDarkEnabled
                  ? "translate-x-5 text-primary"
                  : "translate-x-0 text-muted-foreground",
              )}
            >
              {isDarkEnabled ? (
                <Moon aria-hidden="true" className="size-3.5" />
              ) : (
                <Sun aria-hidden="true" className="size-3.5" />
              )}
            </span>
          </span>
        </Button>
        <span aria-atomic="true" aria-live="polite" className="sr-only">
          {statusMessage}
        </span>
      </>
    );
  }

  return (
    <>
      <Button
        aria-label={ariaLabel}
          className={cn(
            "bg-surface-container-low hover:bg-surface-container flex h-auto w-full items-center rounded-[1.2rem] px-4 py-3 text-left shadow-none",
            className,
          )}
        data-resolved-theme={renderResolvedTheme}
        data-theme={renderTheme}
        onClick={handleClick}
        suppressHydrationWarning
        type="button"
        variant="ghost"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "bg-surface text-foreground shadow-ambient-sm flex size-10 items-center justify-center rounded-full transition-transform duration-200 ease-out",
              currentTheme.iconClassName,
            )}
          >
            <Icon aria-hidden="true" className="size-4.5" />
          </span>
          <span className="space-y-0.5">
            <span className="text-label-sm text-muted-foreground block">Theme</span>
            <span
              className="text-body-md text-foreground block"
              suppressHydrationWarning
            >
              {currentLabel}
            </span>
          </span>
        </span>
      </Button>
      <span aria-atomic="true" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>
    </>
  );
}
