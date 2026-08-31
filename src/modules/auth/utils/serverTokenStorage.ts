import { cookies } from "next/headers";
import type { AuthTokens, AuthUser } from "@/modules/auth/types";

const ACCESS_TOKEN_COOKIE = "flow_access_token";
const REFRESH_TOKEN_COOKIE = "flow_refresh_token";
const ROLE_COOKIE = "flow_role";
const USER_COOKIE = "flow_user";

const ACCESS_TOKEN_MAX_AGE = 86_400; // 1 day
const REFRESH_TOKEN_MAX_AGE = 604_800; // 7 days

const isProduction = process.env.NODE_ENV === "production";

/**
 * Tokens are `httpOnly` — no client script can read them, so an XSS cannot walk
 * off with a week-long refresh token. Every authenticated request is therefore
 * made from the server (Server Component or Server Action), never the browser.
 */
const tokenCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
} as const;

/**
 * The profile cookie is deliberately readable: `useAuthState` hydrates the
 * avatar and role label from it on mount. It carries no credential.
 */
const profileCookieOptions = {
  path: "/",
  maxAge: ACCESS_TOKEN_MAX_AGE,
  httpOnly: false,
  secure: isProduction,
  sameSite: "lax",
} as const;

export const serverTokenStorage = {
  /**
   * Get JWT Access Token from server cookies
   */
  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  },

  /**
   * Get JWT Refresh Token from server cookies
   */
  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  },

  /**
   * Get User Role from server cookies
   */
  async getRole(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ROLE_COOKIE)?.value ?? null;
  },

  /**
   * Get serialized User Profile from server cookies
   */
  async getUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(USER_COOKIE)?.value;
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Set JWT Tokens in server cookies (Server Actions / Route Handlers)
   */
  async setTokens({ access, refresh }: AuthTokens): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, access, {
      ...tokenCookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refresh, {
      ...tokenCookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  },

  /**
   * Update Access Token only
   */
  async setAccessToken(access: string): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, access, {
      ...tokenCookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  },

  /**
   * Set User Profile in server cookies
   */
  async setUser(user: AuthUser): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(USER_COOKIE, JSON.stringify(user), profileCookieOptions);
    cookieStore.set(ROLE_COOKIE, user.role, profileCookieOptions);
  },

  /**
   * Clear all auth cookies on the server
   */
  async clearTokens(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete(ROLE_COOKIE);
    cookieStore.delete(USER_COOKIE);
  },
};
