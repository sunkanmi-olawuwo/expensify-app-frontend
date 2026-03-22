"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { authService } from "./auth-service";
import {
  clearAuthSession,
  decodeAuthClaims,
  decodeUser,
  getRefreshToken,
  getStoredUser,
  getToken,
  isTokenExpired,
  setStoredUser,
  setTokens,
} from "./auth-store";
import { DEFAULT_SIGNUP_ROLE } from "./types";

import type { AuthUser, RegisterResponse, UserProfile } from "./types";
import type { ReactNode } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<RegisterResponse>;
  updateUser: (user: AuthUser) => void;
  user: AuthUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createUserFromProfile(
  token: string,
  profile: UserProfile,
): AuthUser | null {
  const claims = decodeAuthClaims(token);

  if (!claims || profile.id !== claims.id) {
    return null;
  }

  return {
    email: claims.email,
    firstName: profile.firstName,
    id: claims.id,
    lastName: profile.lastName,
    role: claims.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function resolveUserForToken(
    token: string,
    fallbackUser: AuthUser | null = getStoredUser(),
  ): Promise<AuthUser | null> {
    const decodedUser = decodeUser(token, fallbackUser);

    if (decodedUser) {
      return decodedUser;
    }

    const profile = await authService.getProfile();

    return createUserFromProfile(token, profile);
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateAuthState() {
      const token = getToken();

      if (!token) {
        clearAuthSession();

        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      if (!isTokenExpired(token)) {
        try {
          const hydratedUser = await resolveUserForToken(token);

          if (!hydratedUser) {
            throw new Error("Unable to resolve the authenticated user.");
          }

          setStoredUser(hydratedUser);

          if (isMounted) {
            setUser(hydratedUser);
            setIsLoading(false);
          }

          return;
        } catch {
          clearAuthSession();

          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }

          return;
        }
      }

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthSession();

        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const refreshed = await authService.refreshTokens({
          refreshToken,
          token,
        });
        const refreshedUser = await resolveUserForToken(
          refreshed.token,
          getStoredUser(),
        );

        if (!refreshedUser) {
          throw new Error("Unable to resolve the refreshed user.");
        }

        setTokens(refreshed.token, refreshed.refreshToken);
        setStoredUser(refreshedUser);

        if (isMounted) {
          setUser(refreshedUser);
        }
      } catch {
        clearAuthSession();

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrateAuthState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const response = await authService.login({ email, password });

    setTokens(response.token, response.refreshToken);
    try {
      const nextUser = await resolveUserForToken(response.token);

      if (!nextUser) {
        throw new Error("Unable to resolve the authenticated user.");
      }

      setStoredUser(nextUser);
      setUser(nextUser);
    } catch (error) {
      clearAuthSession();
      setUser(null);
      throw error;
    }

    router.push("/dashboard");
  }

  async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string = DEFAULT_SIGNUP_ROLE,
  ): Promise<RegisterResponse> {
    return authService.register({
      email,
      firstName,
      lastName,
      password,
      role,
    });
  }

  function logout(): Promise<void> {
    void authService.logout().catch(() => undefined);

    clearAuthSession();
    setUser(null);
    router.replace("/login?status=logged_out");

    return Promise.resolve();
  }

  function updateUser(nextUser: AuthUser): void {
    setStoredUser(nextUser);
    setUser(nextUser);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        register,
        updateUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
