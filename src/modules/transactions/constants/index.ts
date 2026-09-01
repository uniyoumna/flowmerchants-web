/** Constants for the transactions module. */
import {
  ALL_TRANSACTIONS,
  type TransactionScope,
  type TransactionStatus,
  type TransactionStatusTab,
  type TransactionType,
} from "../types";

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  reversed: "Reversed",
  failed: "Failed",
};

export const TRANSACTION_STATUS_STYLES: Record<TransactionStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  reversed: "bg-slate-100 text-slate-500",
  failed: "bg-rose-100 text-rose-600",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  refund: "Refund",
};

export const TRANSACTION_TYPE_STYLES: Record<TransactionType, string> = {
  purchase: "bg-purple-100 text-[#7C3AED]",
  refund: "bg-rose-100 text-rose-600",
};

/** Pill captions. "All" is the sentinel; the rest reuse the status labels. */
export const TRANSACTION_STATUS_TAB_LABELS: Record<
  TransactionStatusTab,
  string
> = {
  [ALL_TRANSACTIONS]: "All",
  completed: TRANSACTION_STATUS_LABELS.completed,
  pending: TRANSACTION_STATUS_LABELS.pending,
  reversed: TRANSACTION_STATUS_LABELS.reversed,
  failed: TRANSACTION_STATUS_LABELS.failed,
};

/** Route each scope belongs to — the tabs preserve the page they are on. */
export const TRANSACTION_SCOPE_PATHS: Record<TransactionScope, string> = {
  [ALL_TRANSACTIONS]: "/transactions",
  purchase: "/transactions/purchases",
  refund: "/transactions/refund",
};

/** Page heading per scope. */
export const TRANSACTION_SCOPE_LABELS: Record<TransactionScope, string> = {
  [ALL_TRANSACTIONS]: "All Transactions",
  purchase: "Purchases",
  refund: "Refunds",
};

/* ─── Transactions list screen ─── */

export const TRANSACTIONS_PAGE_SIZE = 10;
export const TRANSACTIONS_SEARCH_DEBOUNCE_MS = 350;

/** URL query keys — shared by the page (server) and the filter bar (client). */
export const TRANSACTIONS_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;
