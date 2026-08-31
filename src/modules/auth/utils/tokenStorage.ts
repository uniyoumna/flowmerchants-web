import type {
  AuthTokens,
  AuthUser,
  DecodedJwtPayload,
  LoginCredentials,
} from "@/modules/auth/types";

const ACCESS_TOKEN_COOKIE = "flow_access_token";
const REFRESH_TOKEN_COOKIE = "flow_refresh_token";
const ROLE_COOKIE = "flow_role";
const USER_COOKIE = "flow_user";
const PENDING_CREDENTIALS_KEY = "flow_pending_credentials";

// ─── Cookie Helpers ─────────────────────────────────────────────────────────

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
): void {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: client cookie management
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: client cookie management
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Unified Cookie Storage ──────────────────────────────────────────────────

export const tokenStorage = {
  // ─── Token Management (Cookies) ───────────────────────────────────────────
  getAccessToken(): string | null {
    return getCookie(ACCESS_TOKEN_COOKIE);
  },

  getRefreshToken(): string | null {
    return getCookie(REFRESH_TOKEN_COOKIE);
  },

  setTokens({ access, refresh }: AuthTokens): void {
    // 1 day for access token, 7 days for refresh token
    setCookie(ACCESS_TOKEN_COOKIE, access, 86400);
    setCookie(REFRESH_TOKEN_COOKIE, refresh, 604800);
  },

  setAccessToken(access: string): void {
    setCookie(ACCESS_TOKEN_COOKIE, access, 86400);
  },

  clearTokens(): void {
    deleteCookie(ACCESS_TOKEN_COOKIE);
    deleteCookie(REFRESH_TOKEN_COOKIE);
    deleteCookie(ROLE_COOKIE);
    deleteCookie(USER_COOKIE);
  },

  // ─── User Session (Cookies) ───────────────────────────────────────────────
  getUser(): AuthUser | null {
    const raw = getCookie(USER_COOKIE);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    setCookie(USER_COOKIE, JSON.stringify(user), 86400);
    setCookie(ROLE_COOKIE, user.role, 86400);
  },

  clearUser(): void {
    deleteCookie(USER_COOKIE);
    deleteCookie(ROLE_COOKIE);
  },

  // ─── Temporary Credentials for OTP Verification ───────────────────────────
  getPendingCredentials(): LoginCredentials | null {
    if (typeof window === "undefined") return null;

    try {
      const item = sessionStorage.getItem(PENDING_CREDENTIALS_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setPendingCredentials(credentials: LoginCredentials): void {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(
        PENDING_CREDENTIALS_KEY,
        JSON.stringify(credentials),
      );
    } catch {
      // ignore storage errors
    }
  },

  clearPendingCredentials(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(PENDING_CREDENTIALS_KEY);
    } catch {
      // ignore storage errors
    }
  },

  // ─── JWT Parsing & Expiry Checks ──────────────────────────────────────────
  decodeJwt<T = DecodedJwtPayload>(token: string): T | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = atob(base64);

      return JSON.parse(decodedJson) as T;
    } catch {
      return null;
    }
  },

  isTokenExpired(token: string, bufferSeconds = 30): boolean {
    const payload = this.decodeJwt(token);
    if (!payload?.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - bufferSeconds <= currentTime;
  },
};
