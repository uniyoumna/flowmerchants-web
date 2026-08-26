import env from "@/config/env";

// ─── Types ───────────────────────────────────────────────────────────────────
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

type FetchOptions = {
  /** HTTP method — defaults to GET */
  method?: HttpMethod;
  /** Request body — auto-serialized to JSON */
  body?: unknown;
  /** Additional headers merged with defaults */
  headers?: HeadersInit;
  /** Next.js cache revalidation in seconds */
  revalidate?: number | false;
  /** Next.js cache tags for on-demand revalidation */
  tags?: string[];
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Auth token — injected as Bearer token in Authorization header */
  token?: string;
  /** Next.js cache strategy */
  cache?: RequestCache;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildHeaders(options: FetchOptions): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.headers) {
    const extraHeaders = new Headers(options.headers);
    for (const [key, value] of extraHeaders.entries()) {
      headers.set(key, value);
    }
  }

  return headers;
}

function buildUrl(path: string): string {
  // If the path is already a full URL, use it as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseUrl = env.API_URL?.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return `${baseUrl}/${cleanPath}`;
}

// ─── Main Fetch Function ─────────────────────────────────────────────────────

/**
 * A comprehensive fetch wrapper with caching, error handling, and type safety.
 *
 * Works in both server and client contexts. On the server, it leverages
 * Next.js extended fetch for caching via `next.revalidate` and `next.tags`.
 *
 * @example
 * ```ts
 * // GET with caching
 * const { data, error } = await customFetch<User[]>("/users", {
 *   revalidate: 60,
 *   tags: ["users"],
 * });
 *
 * // POST with auth
 * const { data, error } = await customFetch<LoginResponse>("/auth/login", {
 *   method: "POST",
 *   body: { email, password },
 *   token: sessionToken,
 * });
 * ```
 */
async function customFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    revalidate,
    tags,
    timeout = 10_000,
    cache,
  } = options;

  const url = buildUrl(path);
  const headers = buildHeaders(options);

  if (!env.API_URL) {
    return {
      data: null,
      error: "API URL is not defined",
      status: 500,
    };
  }

  // Build the Next.js-extended fetch init
  const fetchInit: RequestInit & { next?: Record<string, unknown> } = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    fetchInit.body = JSON.stringify(body);
  }

  // Next.js cache configuration
  if (revalidate !== undefined || tags) {
    fetchInit.next = {};

    if (revalidate !== undefined) fetchInit.next.revalidate = revalidate;
    if (tags) fetchInit.next.tags = tags;
  }

  if (cache) {
    fetchInit.cache = cache;
  }

  // Timeout via AbortController
  const controller = new AbortController();
  fetchInit.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, fetchInit);
    clearTimeout(timeoutId);

    // Try to parse JSON, fall back to null for empty responses
    let data: T | null = null;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = (await response.json()) as T;
    }

    if (!response.ok) {
      // Try to extract error message from response body
      const errorMessage =
        (data as Record<string, unknown> | null)?.message ??
        (data as Record<string, unknown> | null)?.error ??
        `Request failed with status ${response.status}`;

      return {
        data: null,
        error: String(errorMessage),
        status: response.status,
      };
    }

    return { data, error: null, status: response.status };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        data: null,
        error: `Request timed out after ${timeout}ms`,
        status: 408,
      };
    }

    return {
      data: null,
      error: err instanceof Error ? err.message : "An unknown error occurred",
      status: 500,
    };
  }
}

export { customFetch };
export type { ApiResponse, FetchOptions, HttpMethod };
