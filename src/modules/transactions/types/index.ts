// ─── API shapes ──────────────────────────────────────────────────────────────

export type ApiTransaction = {
  id: string;
  reference?: string | null;
  merchant_id?: string | null;
  merchant_name?: string | null;
  branch_name?: string | null;
  customer_name?: string | null;
  type: string;
  product?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  created_at?: string | null;
  status: string;
};

// ─── View model ──────────────────────────────────────────────────────────────

export const TRANSACTION_STATUSES = [
  "completed",
  "pending",
  "reversed",
  "failed",
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export function isTransactionStatus(value: string): value is TransactionStatus {
  return (TRANSACTION_STATUSES as readonly string[]).includes(value);
}

/** A purchase moves money to the merchant; a refund sends it back. */
export const TRANSACTION_TYPES = ["purchase", "refund"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export function isTransactionType(value: string): value is TransactionType {
  return (TRANSACTION_TYPES as readonly string[]).includes(value);
}

/** Sentinel for "no filter" — used by both the status pills and the scope. */
export const ALL_TRANSACTIONS = "all";

/**
 * Which slice of the ledger a page shows.
 *
 * This is the *route*, not a filter the user picks: `/transactions` is `all`,
 * `/transactions/purchases` is `purchase`, `/transactions/refund` is `refund`.
 * The status pills then filter within whichever scope the page is in.
 */
export const TRANSACTION_SCOPES = [
  ALL_TRANSACTIONS,
  ...TRANSACTION_TYPES,
] as const;

export type TransactionScope = (typeof TRANSACTION_SCOPES)[number];

/** The status pills above the table, in the order they are shown. */
export const TRANSACTION_STATUS_TABS = [
  ALL_TRANSACTIONS,
  ...TRANSACTION_STATUSES,
] as const;

export type TransactionStatusTab = (typeof TRANSACTION_STATUS_TABS)[number];

export function isTransactionStatusTab(
  value: string,
): value is TransactionStatusTab {
  return (TRANSACTION_STATUS_TABS as readonly string[]).includes(value);
}

export type Transaction = {
  id: string;
  /** Human-facing reference, e.g. `TXN-250108-0091`. */
  reference: string;
  merchantId: string;
  merchantName: string;
  branchName: string;
  customerName: string;
  type: TransactionType;
  /** Financing product — `BNPL`, `Installment`, `Auto Finance`. */
  product: string;
  amount: number;
  currency: string;
  /** Pre-formatted `2025-01-08 09:12`. */
  createdAt: string;
  status: TransactionStatus;
};

// ─── Query params and results ────────────────────────────────────────────────

export type TransactionsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  /** `all` sends no status filter; anything else goes to the backend. */
  status: TransactionStatusTab;
  /** Fixed by the route, never by the user. */
  scope: TransactionScope;
  ordering: string;
};

export type TransactionsListResult = {
  data: Transaction[];
  /** Rows matching every active filter — drives pagination. */
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  /**
   * Rows in this scope ignoring search and status, so the footer can read
   * "2 of 14 transactions" — how much of the ledger the filter narrowed to.
   */
  scopeTotal: number;
  error: string | null;
};

/**
 * KPI figures for the cards. Scoped to the page: the Purchases screen reports
 * zero refunds rather than the ledger-wide figure, because a card that ignored
 * the scope would contradict the table under it.
 */
export type TransactionsOverview = {
  totalPurchases: number;
  purchaseCount: number;
  totalRefunds: number;
  refundCount: number;
  completed: number;
  pending: number;
  currency: string;
};
