import type {
  ApiUserResponse,
  AuthTokens,
  LoginCredentials,
  TokenRefreshResponse,
} from "@/modules/auth/types";
import { customFetch } from "@/utils/fetch";

export const authService = {
  /**
   * Phase 1: Validate credentials and trigger OTP email dispatch
   * POST /api/auth/token
   */
  async requestOtp(
    credentials: LoginCredentials,
  ): Promise<{ data: unknown; error: string | null }> {
    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanPassword = credentials.password;

    const { data, error } = await customFetch.post(
      "/api/auth/token",
      {
        email: cleanEmail,
        password: cleanPassword,
      },
      { cache: "no-store" },
    );

    if (error) {
      return {
        data: null,
        error: error || "Invalid email or password.",
      };
    }

    return { data, error: null };
  },

  /**
   * Phase 2: Complete login with email, password, and OTP code
   * POST /api/auth/token?otp={otp}
   */
  async loginWithOtp(
    credentials: LoginCredentials,
    otp: string,
  ): Promise<{ data: AuthTokens | null; error: string | null }> {
    const cleanOtp = otp.trim();
    const cleanEmail = credentials.email.trim().toLowerCase();
    const cleanPassword = credentials.password;

    const endpoint = `/api/auth/token?otp=${encodeURIComponent(cleanOtp)}`;

    const { data, error } = await customFetch.post<AuthTokens>(
      endpoint,
      {
        email: cleanEmail,
        password: cleanPassword,
      },
      { cache: "no-store" },
    );

    if (error || !data) {
      return {
        data: null,
        error: error || "Authentication failed. Please verify your OTP code.",
      };
    }

    return { data, error: null };
  },

  /**
   * Retrieve current authenticated user profile
   * GET /api/auth/me
   */
  async getCurrentUser(
    token?: string,
  ): Promise<{ data: ApiUserResponse | null; error: string | null }> {
    const { data, error } = await customFetch.get<ApiUserResponse>(
      "/api/auth/me",
      {
        token,
        cache: "no-store",
      },
    );

    if (error || !data) {
      return {
        data: null,
        error: error || "Failed to retrieve user profile.",
      };
    }

    return { data, error: null };
  },

  /**
   * Refresh JWT access token
   * POST /api/auth/token/refresh
   */
  async refreshToken(
    refreshTokenStr: string,
  ): Promise<{ data: TokenRefreshResponse | null; error: string | null }> {
    const { data, error } = await customFetch.post<TokenRefreshResponse>(
      "/api/auth/token/refresh",
      {
        refresh: refreshTokenStr,
      },
      { cache: "no-store" },
    );

    if (error || !data) {
      return {
        data: null,
        error: error || "Failed to refresh session token.",
      };
    }

    return { data, error: null };
  },

  /**
   * Blacklist refresh token on logout
   * POST /api/auth/token/blacklist
   */
  async blacklistToken(refreshTokenStr: string): Promise<void> {
    try {
      await customFetch.post(
        "/api/auth/token/blacklist",
        {
          refresh: refreshTokenStr,
        },
        { cache: "no-store" },
      );
    } catch {
      // ignore blacklist errors on logout
    }
  },
};
