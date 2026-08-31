import {
  DEFAULT_ORDERING,
  DEFAULT_PAGE_SIZE,
  MERCHANTS_QUERY_KEYS,
} from "../constants";
import {
  ALL_STATUSES,
  isMerchantStatus,
  type MerchantsQueryParams,
} from "../types";

/** The shape Next.js hands a page via its `searchParams` prop. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function toPositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseMerchantsSearchParams(
  searchParams: RawSearchParams = {},
): MerchantsQueryParams {
  const rawStatus = firstValue(searchParams[MERCHANTS_QUERY_KEYS.status]);
  const rawOrdering = firstValue(searchParams[MERCHANTS_QUERY_KEYS.ordering]);

  return {
    page: toPositiveInt(firstValue(searchParams[MERCHANTS_QUERY_KEYS.page]), 1),
    pageSize: toPositiveInt(
      firstValue(searchParams[MERCHANTS_QUERY_KEYS.pageSize]),
      DEFAULT_PAGE_SIZE,
    ),
    search: firstValue(searchParams[MERCHANTS_QUERY_KEYS.search]).trim(),
    status: isMerchantStatus(rawStatus) ? rawStatus : ALL_STATUSES,
    ordering:
      rawOrdering && rawOrdering !== DEFAULT_ORDERING ? rawOrdering : "",
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a filter
 * change re-triggers the fallback instead of showing stale rows.
 */
export function serializeMerchantsQuery(query: MerchantsQueryParams): string {
  return [
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}
