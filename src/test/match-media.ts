type MatchMediaListener = (event: MediaQueryListEvent) => void;

const mediaQueryListeners = new Map<string, Set<MatchMediaListener>>();

let prefersDarkMode = false;

function getListeners(query: string): Set<MatchMediaListener> {
  if (!mediaQueryListeners.has(query)) {
    mediaQueryListeners.set(query, new Set<MatchMediaListener>());
  }

  return mediaQueryListeners.get(query)!;
}

function emitMediaQueryChange(query: string) {
  const event = {
    matches: query === "(prefers-color-scheme: dark)" ? prefersDarkMode : false,
    media: query,
  } as MediaQueryListEvent;

  getListeners(query).forEach((listener) => {
    listener(event);
  });
}

export function createMockMatchMedia() {
  return (query: string): MediaQueryList => ({
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === "function") {
        getListeners(query).add(listener as MatchMediaListener);
      }
    },
    addListener: (listener: MatchMediaListener) => {
      getListeners(query).add(listener);
    },
    dispatchEvent: (event: Event) => {
      getListeners(query).forEach((listener) => {
        listener(event as MediaQueryListEvent);
      });

      return true;
    },
    matches: query === "(prefers-color-scheme: dark)" ? prefersDarkMode : false,
    media: query,
    onchange: null,
    removeEventListener: (
      _type: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (typeof listener === "function") {
        getListeners(query).delete(listener as MatchMediaListener);
      }
    },
    removeListener: (listener: MatchMediaListener) => {
      getListeners(query).delete(listener);
    },
  });
}

export function resetMatchMediaMocks() {
  prefersDarkMode = false;
  mediaQueryListeners.clear();
}

export function setMockPrefersColorScheme(
  scheme: "light" | "dark",
  options?: { notify?: boolean },
) {
  prefersDarkMode = scheme === "dark";

  if (options?.notify !== false) {
    emitMediaQueryChange("(prefers-color-scheme: dark)");
  }
}
