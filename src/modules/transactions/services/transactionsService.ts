import { customFetch } from "@/utils/fetch";
import { TRANSACTIONS_PAGE_SIZE } from "../constants";
import {
  ALL_TRANSACTIONS,
  type ApiTransaction,
  type Transaction,
  type TransactionScope,
  type TransactionsListResult,
  type TransactionsOverview,
  type TransactionsQueryParams,
} from "../types";
import { mapApiTransaction } from "../utils/transactionMapper";
import { MOCK_TRANSACTIONS } from "./transactionsMockData";

const TRANSACTIONS_ENDPOINT = "/api/v1/transactions/transactions/";

/**
 * The transaction endpoints are not deployed yet. Set this to `false` and
 * delete `transactionsMockData.ts` once they ship — the request code below is
 * already written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the transaction endpoints are deployed.
const USE_MOCK_TRANSACTIONS = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** The scope is the page's own slice of the ledger, never a user filter. */
function inScope(transaction: Transaction, scope: TransactionScope): boolean {
  return scope === ALL_TRANSACTIONS || transaction.type === scope;
}

/** Mirrors server-side filtering so the mock behaves like the real endpoint. */
function filterMockTransactions(query: TransactionsQueryParams): Transaction[] {
  const search = query.search.toLowerCase();

  return MOCK_TRANSACTIONS.filter((transaction) => {
    if (!inScope(transaction, query.scope)) return false;

    if (
      query.status !== ALL_TRANSACTIONS &&
      transaction.status !== query.status
    ) {
      return false;
    }

    if (!search) return true;

    return (
      transaction.merchantName.toLowerCase().includes(search) ||
      transaction.reference.toLowerCase().includes(search) ||
      transaction.customerName.toLowerCase().includes(search)
    );
  });
}

/**
 * One page of transactions.
 *
 * Both the scope and the status pill are server-side filters, so only the rows
 * on screen are ever transferred. Never throws — a failure comes back as
 * `error` so the table can render a banner in place of the rows.
 */
export async function fetchTransactions(
  query: TransactionsQueryParams,
): Promise<TransactionsListResult> {
  const pageSize = query.pageSize || TRANSACTIONS_PAGE_SIZE;

  if (USE_MOCK_TRANSACTIONS) {
    const filtered = filterMockTransactions(query);
    const start = (query.page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      page: query.page,
      pageSize,
      scopeTotal: MOCK_TRANSACTIONS.filter((t) => inScope(t, query.scope))
        .length,
      error: null,
    };
  }

  const { data, error } = await customFetch.get<
    PaginatedResponse<ApiTransaction>
  >(TRANSACTIONS_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
      type: query.scope === ALL_TRANSACTIONS ? undefined : query.scope,
      status: query.status === ALL_TRANSACTIONS ? undefined : query.status,
      ordering: query.ordering || undefined,
    },
    cache: "no-store",
  });

  if (error || !data) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      page: query.page,
      pageSize,
      scopeTotal: 0,
      error: error ?? "Failed to load transactions.",
    };
  }

  return {
    data: data.results.map(mapApiTransaction),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    scopeTotal: data.count,
    error: null,
  };
}

/**
 * The four KPI cards, scoped to the page.
 *
 * Summed from the transactions themselves so the cards cannot contradict the
 * table beneath them. Because the figures are scoped, the Purchases screen
 * reports zero refunds rather than the ledger-wide total.
 */
export async function fetchTransactionsOverview(
  scope: TransactionScope,
): Promise<TransactionsOverview> {
  if (USE_MOCK_TRANSACTIONS) {
    const scoped = MOCK_TRANSACTIONS.filter((t) => inScope(t, scope));
    const purchases = scoped.filter((t) => t.type === "purchase");
    const refunds = scoped.filter((t) => t.type === "refund");
    const sum = (rows: Transaction[]) =>
      rows.reduce((total, row) => total + row.amount, 0);

    return {
      totalPurchases: sum(purchases),
      purchaseCount: purchases.length,
      totalRefunds: sum(refunds),
      refundCount: refunds.length,
      completed: scoped.filter((t) => t.status === "completed").length,
      pending: scoped.filter((t) => t.status === "pending").length,
      currency: "EGP",
    };
  }

  const { data } = await customFetch.get<TransactionsOverview>(
    `${TRANSACTIONS_ENDPOINT}overview/`,
    {
      params: { type: scope === ALL_TRANSACTIONS ? undefined : scope },
      cache: "no-store",
    },
  );

  return (
    data ?? {
      totalPurchases: 0,
      purchaseCount: 0,
      totalRefunds: 0,
      refundCount: 0,
      completed: 0,
      pending: 0,
      currency: "EGP",
    }
  );
}
