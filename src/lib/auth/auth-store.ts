import type { AuthUser } from "./types";

type DecodedAuthClaims = Pick<AuthUser, "email" | "id" | "role"> & {
  firstName: string | null;
  lastName: string | null;
};

const TOKEN_STORAGE_KEY = "expensify.auth.token";
const REFRESH_TOKEN_STORAGE_KEY = "expensify.auth.refreshToken";
const USER_STORAGE_KEY = "expensify.auth.user";

let inMemoryToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let inMemoryUser: AuthUser | null = null;

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

function readStorage(key: string): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so auth writes do not crash the client.
  }
}

function removeStorage(key: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage failures so auth cleanup never throws during redirects.
  }
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : `${normalized}${"=".repeat(4 - padding)}`;

  if (typeof atob === "function") {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(padded, "base64").toString("utf-8");
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const [, payload] = token.split(".");

  if (!payload) {
    throw new Error("JWT payload segment is missing.");
  }

  const decoded = JSON.parse(decodeBase64Url(payload)) as unknown;

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("JWT payload is not an object.");
  }

  return decoded as Record<string, unknown>;
}

function asOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function asOptionalStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function looksLikeEmail(value: string | null): boolean {
  return value !== null && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readClaim(payload: Record<string, unknown>, claimNames: string[]): string | null {
  for (const claimName of claimNames) {
    const value = asOptionalString(payload[claimName]);

    if (value) {
      return value;
    }

    const [firstArrayValue] = asOptionalStringArray(payload[claimName]);

    if (firstArrayValue) {
      return firstArrayValue;
    }
  }

  return null;
}

function readStoredUserSnapshot(): AuthUser | null {
  const stored = readStorage(USER_STORAGE_KEY);

  if (!stored) {
    return inMemoryUser;
  }

  try {
    const parsed = JSON.parse(stored) as unknown;

    if (typeof parsed !== "object" || parsed === null) {
      return inMemoryUser;
    }

    const user = parsed as AuthUser;

    inMemoryUser = user;

    return user;
  } catch {
    return inMemoryUser;
  }
}

export function getToken(): string | null {
  const token = readStorage(TOKEN_STORAGE_KEY);

  if (token !== null) {
    inMemoryToken = token;
  }

  return token ?? inMemoryToken;
}

export function getRefreshToken(): string | null {
  const token = readStorage(REFRESH_TOKEN_STORAGE_KEY);

  if (token !== null) {
    inMemoryRefreshToken = token;
  }

  return token ?? inMemoryRefreshToken;
}

export function setTokens(token: string, refreshToken: string): void {
  inMemoryToken = token;
  inMemoryRefreshToken = refreshToken;

  writeStorage(TOKEN_STORAGE_KEY, token);
  writeStorage(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function clearTokens(): void {
  inMemoryToken = null;
  inMemoryRefreshToken = null;

  removeStorage(TOKEN_STORAGE_KEY);
  removeStorage(REFRESH_TOKEN_STORAGE_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    const exp = payload.exp;

    if (typeof exp !== "number") {
      return true;
    }

    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function decodeAuthClaims(token: string): DecodedAuthClaims | null {
  try {
    const payload = decodeJwtPayload(token);
    const subject = readClaim(payload, ["sub"]);
    const id =
      readClaim(payload, [
        "userid",
        "userId",
        "id",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid",
      ]) ?? (!looksLikeEmail(subject) ? subject : null);
    const email =
      readClaim(payload, [
        "email",
        "preferred_username",
        "upn",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      ]) ?? (looksLikeEmail(subject) ? subject : null);
    const role = readClaim(payload, [
      "role",
      "roles",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    ]);
    const firstName = readClaim(payload, [
      "firstName",
      "given_name",
      "givenName",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    ]);
    const lastName = readClaim(payload, [
      "lastName",
      "family_name",
      "familyName",
      "surname",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
    ]);

    if (!id || !email || !role) {
      return null;
    }

    return {
      email,
      firstName,
      id,
      lastName,
      role,
    };
  } catch {
    return null;
  }
}

export function decodeUser(
  token: string,
  fallbackUser: AuthUser | null = null,
): AuthUser | null {
  const claims = decodeAuthClaims(token);

  if (!claims) {
    return null;
  }

  const matchingFallbackUser =
    fallbackUser &&
    fallbackUser.id === claims.id &&
    fallbackUser.email === claims.email
      ? fallbackUser
      : null;
  const firstName = claims.firstName ?? matchingFallbackUser?.firstName ?? null;
  const lastName = claims.lastName ?? matchingFallbackUser?.lastName ?? null;

  if (!firstName || !lastName) {
    return null;
  }

  return {
    email: claims.email,
    firstName,
    id: claims.id,
    lastName,
    role: claims.role,
  };
}

export function getStoredUser(): AuthUser | null {
  return readStoredUserSnapshot();
}

export function setStoredUser(user: AuthUser): void {
  inMemoryUser = user;
  writeStorage(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  inMemoryUser = null;
  removeStorage(USER_STORAGE_KEY);
}

export function clearAuthSession(): void {
  clearTokens();
  clearStoredUser();
}
