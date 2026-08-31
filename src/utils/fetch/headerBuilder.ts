import type { FetchOptions } from "@/utils/fetch/types";

/**
 * Universally resolves access token from cookies on both Server and Client
 */
async function resolveAuthToken(
  explicitToken?: string | null,
): Promise<string | null> {
  // If explicitly provided as a string, use it
  if (typeof explicitToken === "string") {
    return explicitToken;
  }

  // If explicitly passed as null, do NOT inject any token
  if (explicitToken === null) {
    return null;
  }

  // Auto-resolve in Browser Client
  if (typeof window !== "undefined") {
    try {
      const { tokenStorage } = await import(
        "@/modules/auth/utils/tokenStorage"
      );

      return tokenStorage.getAccessToken();
    } catch {
      return null;
    }
  }

  // Auto-resolve on Next.js Server (Server Actions / Server Components)
  try {
    const { serverTokenStorage } = await import(
      "@/modules/auth/utils/serverTokenStorage"
    );
    return await serverTokenStorage.getAccessToken();
  } catch {
    return null;
  }
}

/**
 * Builds HTTP headers with auto-injected Content-Type and Bearer authorization
 */
export async function buildHeaders(options: FetchOptions): Promise<Headers> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const token = await resolveAuthToken(options.token);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.headers) {
    const extraHeaders = new Headers(options.headers);

    for (const [key, value] of extraHeaders.entries()) {
      headers.set(key, value);
    }
  }

  return headers;
}
