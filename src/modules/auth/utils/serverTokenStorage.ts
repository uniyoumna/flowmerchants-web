import { cookies } from "next/headers";
import type { AuthTokens, AuthUser } from "@/modules/auth/types";

const ACCESS_TOKEN_COOKIE = "flow_access_token";
const REFRESH_TOKEN_COOKIE = "flow_refresh_token";
const ROLE_COOKIE = "flow_role";
const USER_COOKIE = "flow_user";

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
      path: "/",
      maxAge: 86400, // 1 day
      sameSite: "lax",
      httpOnly: false,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refresh, {
      path: "/",
      maxAge: 604800, // 7 days
      sameSite: "lax",
      httpOnly: false,
    });
  },

  /**
   * Update Access Token only
   */
  async setAccessToken(access: string): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, access, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false,
    });
  },

  /**
   * Set User Profile in server cookies
   */
  async setUser(user: AuthUser): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set(USER_COOKIE, JSON.stringify(user), {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false,
    });

    cookieStore.set(ROLE_COOKIE, user.role, {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false,
    });
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
