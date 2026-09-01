import { SETTLEMENTS_PAGE_SIZE, SETTLEMENTS_QUERY_KEYS } from "../constants";
import {
  ALL_SETTLEMENTS,
  isSettlementTab,
  type SettlementsQueryParams,
  type SettlementTab,
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
export function parseSettlementsSearchParams(
  searchParams: RawSearchParams = {},
): SettlementsQueryParams {
  const rawStatus = firstValue(searchParams[SETTLEMENTS_QUERY_KEYS.status]);

  return {
    page: toPositiveInt(
      firstValue(searchParams[SETTLEMENTS_QUERY_KEYS.page]),
      1,
    ),
    pageSize: toPositiveInt(
      firstValue(searchParams[SETTLEMENTS_QUERY_KEYS.pageSize]),
      SETTLEMENTS_PAGE_SIZE,
    ),
    search: firstValue(searchParams[SETTLEMENTS_QUERY_KEYS.search]).trim(),
    status: isSettlementTab(rawStatus) ? rawStatus : ALL_SETTLEMENTS,
    ordering: firstValue(searchParams[SETTLEMENTS_QUERY_KEYS.ordering]),
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a tab
 * change re-triggers the skeleton instead of showing the previous tab's rows.
 */
export function serializeSettlementsQuery(
  query: SettlementsQueryParams,
): string {
  return [
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}

/** `/settlements?status=overdue` — the All tab stays on the bare path. */
export function buildSettlementsTabHref(
  tab: SettlementTab,
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams.toString());

  if (tab === ALL_SETTLEMENTS) {
    params.delete(SETTLEMENTS_QUERY_KEYS.status);
  } else {
    params.set(SETTLEMENTS_QUERY_KEYS.status, tab);
  }

  // Switching tabs changes the result set, so the old page number is meaningless.
  params.delete(SETTLEMENTS_QUERY_KEYS.page);

  const queryString = params.toString();
  return queryString ? `/settlements?${queryString}` : "/settlements";
}
