export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** A single query-string value. `null`/`undefined`/`""` are dropped when serialized. */
export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<string | number>;

export type QueryParams = Record<string, QueryParamValue>;

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
  /**
   * Query string params — appended to the URL.
   * Empty values are omitted and arrays are repeated (`?status=a&status=b`).
   */
  params?: QueryParams;
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
  /** Abort signal — merged with the internal timeout signal */
  signal?: AbortSignal;
};

export type FetchRequestOptions = Omit<FetchOptions, "method" | "body">;
