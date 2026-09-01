import {
  CONFIG_DEFAULT_ORDERING,
  CONFIG_PAGE_SIZE,
  CONFIG_QUERY_KEYS,
} from "../constants";
import {
  ALL_CONFIG_STATUSES,
  type ConfigQueryParams,
  isConfigStatus,
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

/** Validates and defaults every queue filter that can arrive in the URL. */
export function parseConfigSearchParams(
  searchParams: RawSearchParams = {},
): ConfigQueryParams {
  const rawStatus = firstValue(searchParams[CONFIG_QUERY_KEYS.status]);
  const rawOrdering = firstValue(searchParams[CONFIG_QUERY_KEYS.ordering]);

  return {
    page: toPositiveInt(firstValue(searchParams[CONFIG_QUERY_KEYS.page]), 1),
    pageSize: toPositiveInt(
      firstValue(searchParams[CONFIG_QUERY_KEYS.pageSize]),
      CONFIG_PAGE_SIZE,
    ),
    search: firstValue(searchParams[CONFIG_QUERY_KEYS.search]).trim(),
    status: isConfigStatus(rawStatus) ? rawStatus : ALL_CONFIG_STATUSES,
    ordering:
      rawOrdering && rawOrdering !== CONFIG_DEFAULT_ORDERING ? rawOrdering : "",
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a filter
 * change re-triggers the skeleton instead of showing stale rows.
 */
export function serializeConfigQuery(query: ConfigQueryParams): string {
  return [
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}

/** Route of one merchant's configuration screen. */
export function configReviewPath(workflowId: string): string {
  return `/finance/configuration/${encodeURIComponent(workflowId)}`;
}
