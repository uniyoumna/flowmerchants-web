import { RISK_FLAGS_PAGE_SIZE, RISK_FLAGS_QUERY_KEYS } from "../constants";
import {
  ALL_RISK_FLAGS,
  isRiskFlagTab,
  type RiskFlagsQueryParams,
  type RiskFlagTab,
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

/** Validates and defaults every filter that can arrive in the URL. */
export function parseRiskFlagsSearchParams(
  searchParams: RawSearchParams = {},
): RiskFlagsQueryParams {
  const rawStatus = firstValue(searchParams[RISK_FLAGS_QUERY_KEYS.status]);

  return {
    page: toPositiveInt(
      firstValue(searchParams[RISK_FLAGS_QUERY_KEYS.page]),
      1,
    ),
    pageSize: toPositiveInt(
      firstValue(searchParams[RISK_FLAGS_QUERY_KEYS.pageSize]),
      RISK_FLAGS_PAGE_SIZE,
    ),
    search: firstValue(searchParams[RISK_FLAGS_QUERY_KEYS.search]).trim(),
    status: isRiskFlagTab(rawStatus) ? rawStatus : ALL_RISK_FLAGS,
    ordering: firstValue(searchParams[RISK_FLAGS_QUERY_KEYS.ordering]),
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a tab
 * change re-triggers the skeleton instead of showing the previous tab's rows.
 */
export function serializeRiskFlagsQuery(query: RiskFlagsQueryParams): string {
  return [
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}

/** `/risk-flag?status=open` — the All tab stays on the bare path. */
export function buildRiskFlagsTabHref(
  tab: RiskFlagTab,
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams.toString());

  if (tab === ALL_RISK_FLAGS) {
    params.delete(RISK_FLAGS_QUERY_KEYS.status);
  } else {
    params.set(RISK_FLAGS_QUERY_KEYS.status, tab);
  }

  // Switching tabs changes the result set, so the old page number is meaningless.
  params.delete(RISK_FLAGS_QUERY_KEYS.page);

  const queryString = params.toString();
  return queryString ? `/risk-flag?${queryString}` : "/risk-flag";
}
