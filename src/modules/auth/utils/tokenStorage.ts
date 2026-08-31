import type { AuthUser, DecodedJwtPayload } from "@/modules/auth/types";

const ROLE_COOKIE = "flow_role";
const USER_COOKIE = "flow_user";

// ─── Cookie Helpers ─────────────────────────────────────────────────────────

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: client cookie management
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Client-side session helpers.
 *
 * Access and refresh tokens are intentionally absent: they live in `httpOnly`
 * cookies that no script can read, and every authenticated request is issued
 * from the server. Only the non-secret profile is exposed here, so the shell
 * can render an avatar and role label before the session is revalidated.
 */
export const tokenStorage = {
  getUser(): AuthUser | null {
    const raw = getCookie(USER_COOKIE);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  clearUser(): void {
    deleteCookie(USER_COOKIE);
    deleteCookie(ROLE_COOKIE);
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
