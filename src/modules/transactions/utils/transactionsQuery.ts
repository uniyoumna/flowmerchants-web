import {
  TRANSACTION_SCOPE_PATHS,
  TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_QUERY_KEYS,
} from "../constants";
import {
  ALL_TRANSACTIONS,
  isTransactionStatusTab,
  type TransactionScope,
  type TransactionStatusTab,
  type TransactionsQueryParams,
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

/**
 * Validates and defaults every filter in the URL. The scope comes from the
 * route rather than the query string, so it cannot be spoofed by hand-editing
 * the URL into a state the page does not represent.
 */
export function parseTransactionsSearchParams(
  scope: TransactionScope,
  searchParams: RawSearchParams = {},
): TransactionsQueryParams {
  const rawStatus = firstValue(searchParams[TRANSACTIONS_QUERY_KEYS.status]);

  return {
    page: toPositiveInt(
      firstValue(searchParams[TRANSACTIONS_QUERY_KEYS.page]),
      1,
    ),
    pageSize: toPositiveInt(
      firstValue(searchParams[TRANSACTIONS_QUERY_KEYS.pageSize]),
      TRANSACTIONS_PAGE_SIZE,
    ),
    search: firstValue(searchParams[TRANSACTIONS_QUERY_KEYS.search]).trim(),
    status: isTransactionStatusTab(rawStatus) ? rawStatus : ALL_TRANSACTIONS,
    scope,
    ordering: firstValue(searchParams[TRANSACTIONS_QUERY_KEYS.ordering]),
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a filter
 * change re-triggers the skeleton instead of showing the previous rows.
 */
export function serializeTransactionsQuery(
  query: TransactionsQueryParams,
): string {
  return [
    query.scope,
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}

/** Status pill target — stays on the current scope's route. */
export function buildTransactionsStatusHref(
  scope: TransactionScope,
  tab: TransactionStatusTab,
  searchParams: URLSearchParams,
): string {
  const params = new URLSearchParams(searchParams.toString());

  if (tab === ALL_TRANSACTIONS) {
    params.delete(TRANSACTIONS_QUERY_KEYS.status);
  } else {
    params.set(TRANSACTIONS_QUERY_KEYS.status, tab);
  }

  // A new filter means a new result set, so the old page number is meaningless.
  params.delete(TRANSACTIONS_QUERY_KEYS.page);

  const path = TRANSACTION_SCOPE_PATHS[scope];
  const queryString = params.toString();

  return queryString ? `${path}?${queryString}` : path;
}
