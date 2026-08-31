import { extractErrorMessage } from "@/utils/fetch/errorHandler";
import { buildHeaders } from "@/utils/fetch/headerBuilder";
import type {
  ApiResponse,
  FetchOptions,
  FetchRequestOptions,
} from "@/utils/fetch/types";
import { buildUrl } from "@/utils/fetch/urlBuilder";

/**
 * Universal Next.js fetch client with automatic token injection,
 * robust DRF error parsing, timeouts, and Next.js caching support.
 */
async function customFetchCore<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    revalidate,
    tags,
    timeout = 15_000,
    cache,
  } = options;

  const url = buildUrl(path);
  const headers = await buildHeaders(options);

  const fetchInit: RequestInit & { next?: Record<string, unknown> } = {
    method,
    headers,
  };

  if (body !== undefined && method !== "GET") {
    fetchInit.body = typeof body === "string" ? body : JSON.stringify(body);
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

  // Timeout controller
  const controller = new AbortController();
  fetchInit.signal = controller.signal;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, fetchInit);
    clearTimeout(timeoutId);

    let data: T | null = null;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        data = (await response.json()) as T;
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const errorMessage = extractErrorMessage(data, response.status);

      return {
        data: null,
        error: errorMessage,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
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

// ─── HTTP Method Shortcuts ───────────────────────────────────────────────────

export const customFetch = Object.assign(customFetchCore, {
  get<T>(path: string, options?: FetchRequestOptions): Promise<ApiResponse<T>> {
    return customFetchCore<T>(path, { ...options, method: "GET" });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: FetchRequestOptions,
  ): Promise<ApiResponse<T>> {
    return customFetchCore<T>(path, { ...options, method: "POST", body });
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: FetchRequestOptions,
  ): Promise<ApiResponse<T>> {
    return customFetchCore<T>(path, { ...options, method: "PUT", body });
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: FetchRequestOptions,
  ): Promise<ApiResponse<T>> {
    return customFetchCore<T>(path, { ...options, method: "PATCH", body });
  },

  delete<T>(
    path: string,
    options?: FetchRequestOptions,
  ): Promise<ApiResponse<T>> {
    return customFetchCore<T>(path, { ...options, method: "DELETE" });
  },
});
