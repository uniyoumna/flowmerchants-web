export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

export type FetchOptions = {
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
  /** Request timeout in milliseconds (default: 15000) */
  timeout?: number;
  /**
   * Auth token:
   * - `string`: uses explicitly provided token
   * - `null`: explicitly skips token injection
   * - `undefined`: automatically resolves from cookies (server & client)
   */
  token?: string | null;
  /** Next.js cache strategy */
  cache?: RequestCache;
};

export type FetchRequestOptions = Omit<FetchOptions, "method" | "body">;
