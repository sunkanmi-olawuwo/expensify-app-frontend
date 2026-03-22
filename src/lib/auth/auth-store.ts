const ACCESS_TOKEN_STORAGE_KEY = "expensify.auth.accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "expensify.auth.refreshToken";
const USER_STORAGE_KEY = "expensify.auth.user";

let inMemoryAccessToken: string | null = null;

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function getAccessToken(): string | null {
  if (!canUseLocalStorage()) {
    return inMemoryAccessToken;
  }

  try {
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    inMemoryAccessToken = token;

    return token;
  } catch {
    return inMemoryAccessToken;
  }
}

export function clearAuthSession(): void {
  inMemoryAccessToken = null;

  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Ignore storage failures so auth cleanup never throws during redirects.
  }
}
