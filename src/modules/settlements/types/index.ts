// ─── API shapes ──────────────────────────────────────────────────────────────

/**
 * One settlement ticket as the backend reports it. Money arrives either as a
 * number or as a DRF decimal string, and every derived total is optional: an
 * upcoming ticket has no figures yet, which is not the same as zero.
 */
export type ApiSettlementTicket = {
  id: string;
  ticket_id?: string | null;
  merchant_id?: string | null;
  merchant_name?: string | null;
  merchant_code?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  gross?: number | string | null;
  refunds?: number | string | null;
  fees?: number | string | null;
  net?: number | string | null;
  due_date?: string | null;
  status: string;
  bank_account?: string | null;
  currency?: string | null;
};

// ─── View model ──────────────────────────────────────────────────────────────

/**
 * Every lifecycle state a ticket can be in. `failed` never appears as a filter
 * tab but is listed here so a failed transfer still renders its own badge
 * instead of falling back to another status.
 */
export const SETTLEMENT_STATUSES = [
  "due",
  "overdue",
  "processing",
  "held",
  "upcoming",
  "closed",
  "failed",
] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export function isSettlementStatus(value: string): value is SettlementStatus {
  return (SETTLEMENT_STATUSES as readonly string[]).includes(value);
}

/** Sentinel for the "All" tab — no status filter is sent to the backend. */
export const ALL_SETTLEMENTS = "all";

/** The filter tabs above the table, in the order they are shown. */
export const SETTLEMENT_TABS = [
  ALL_SETTLEMENTS,
  "due",
  "overdue",
  "processing",
  "held",
  "upcoming",
  "closed",
] as const;

export type SettlementTab = (typeof SETTLEMENT_TABS)[number];

export function isSettlementTab(value: string): value is SettlementTab {
  return (SETTLEMENT_TABS as readonly string[]).includes(value);
}

/**
 * A ticket as the table renders it.
 *
 * Amounts stay `number | null` rather than collapsing to `0`: an upcoming
 * ticket has not been calculated yet and must read as `—`, while a genuine
 * zero-refund ticket must read as `0`. Collapsing the two would misreport money.
 */
export type SettlementTicket = {
  id: string;
  ticketId: string;
  merchantId: string;
  merchantName: string;
  merchantCode: string;
  /** Pre-formatted range, e.g. `01 Jan 2025 – 07 Jan 2025`. */
  period: string;
  gross: number | null;
  refunds: number | null;
  fees: number | null;
  net: number | null;
  dueDate: string;
  status: SettlementStatus;
  bankAccount: string;
  currency: string;
};

// ─── Query params and results ────────────────────────────────────────────────

export type SettlementsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  /** `all` sends no status filter; anything else is passed straight through. */
  status: SettlementTab;
  ordering: string;
};

export type SettlementsListResult = {
  data: SettlementTicket[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type SettlementsOverview = {
  /** Due + overdue, in minor-unit-free major currency. */
  dueForPayment: number;
  processing: number;
  overdueTickets: number;
  upcomingCount: number;
  currency: string;
};

/** Outcome of closing a ticket or requesting the payment file. */
export type SettlementActionResult = {
  success: boolean;
  error: string | null;
  /** Set when an export produced a downloadable file. */
  fileUrl?: string | null;
};
