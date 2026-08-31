import env from "@/config/env";
import type { QueryParams } from "@/utils/fetch/types";

/**
 * Serializes a query params object into a URL query string.
 *
 * - `undefined`, `null` and empty-string values are dropped, so callers can
 *   pass optional filters through without conditional spreads.
 * - Arrays are serialized as repeated keys (`?status=active&status=draft`),
 *   which is the `style: form, explode: true` convention DRF expects for
 *   multi-value filters such as `status`.
 */
export function buildQueryString(params?: QueryParams): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item === undefined || item === null || item === "") continue;
      searchParams.append(key, String(item));
    }
  }

  return searchParams.toString();
}

export function buildUrl(path: string, params?: QueryParams): string {
  // If the path is already a full URL, use it as-is
  const isAbsolute = path.startsWith("http://") || path.startsWith("https://");

  let url: string;

  if (isAbsolute) {
    url = path;
  } else {
    const baseUrl = env.API_URL.replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");

    url = `${baseUrl}/${cleanPath}`;
  }

  const queryString = buildQueryString(params);
  if (!queryString) return url;

  // Preserve any query string already baked into `path`
  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
}
