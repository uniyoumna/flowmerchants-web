/** Constants for the settlements module. */
import {
  ALL_SETTLEMENTS,
  type SettlementStatus,
  type SettlementTab,
} from "../types";

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  due: "Due",
  overdue: "Overdue",
  processing: "Processing",
  held: "Held",
  upcoming: "Upcoming",
  closed: "Closed",
  failed: "Failed",
};

export const SETTLEMENT_STATUS_STYLES: Record<SettlementStatus, string> = {
  due: "bg-amber-100 text-amber-700",
  overdue: "bg-rose-100 text-rose-600",
  processing: "bg-purple-100 text-[#7C3AED]",
  held: "bg-amber-50 text-amber-600",
  upcoming: "bg-slate-100 text-slate-500",
  closed: "bg-emerald-100 text-emerald-700",
  failed: "bg-rose-100 text-rose-700",
};

/** Tab captions. "All" is the sentinel, the rest reuse the status labels. */
export const SETTLEMENT_TAB_LABELS: Record<SettlementTab, string> = {
  [ALL_SETTLEMENTS]: "All",
  due: SETTLEMENT_STATUS_LABELS.due,
  overdue: SETTLEMENT_STATUS_LABELS.overdue,
  processing: SETTLEMENT_STATUS_LABELS.processing,
  held: SETTLEMENT_STATUS_LABELS.held,
  upcoming: SETTLEMENT_STATUS_LABELS.upcoming,
  closed: SETTLEMENT_STATUS_LABELS.closed,
};

/**
 * Only a ticket the money has not left for yet can be closed by hand, and only
 * a settled one has a receipt. Every other state shows no row action.
 */
export const CLOSEABLE_STATUSES: SettlementStatus[] = ["due", "overdue"];
export const RECEIPT_STATUSES: SettlementStatus[] = ["closed"];

/* ─── Settlements list screen ─── */

export const SETTLEMENTS_PAGE_SIZE = 25;
export const SETTLEMENTS_SEARCH_DEBOUNCE_MS = 350;

/** URL query keys — shared by the page (server) and the tabs (client). */
export const SETTLEMENTS_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;

/* ─── Settlement reports screen ─── */

/**
 * Tile treatment for the status breakdown. Deliberately separate from
 * `SETTLEMENT_STATUS_STYLES`: a badge sits inside a dense table row, whereas a
 * tile is a standalone block and carries a lighter, larger fill.
 */
export const SETTLEMENT_STATUS_TILE_STYLES: Record<
  SettlementStatus,
  { surface: string; text: string }
> = {
  closed: { surface: "bg-emerald-100", text: "text-emerald-700" },
  processing: { surface: "bg-purple-100", text: "text-[#7C3AED]" },
  due: { surface: "bg-amber-100", text: "text-amber-700" },
  overdue: { surface: "bg-rose-100", text: "text-rose-600" },
  held: { surface: "bg-amber-100", text: "text-amber-700" },
  upcoming: { surface: "bg-slate-100", text: "text-slate-500" },
  failed: { surface: "bg-rose-100", text: "text-rose-700" },
};

/**
 * Reading order of the breakdown tiles: settled money first, then everything
 * still owed, then what has not happened yet.
 */
export const SETTLEMENT_REPORT_STATUS_ORDER: SettlementStatus[] = [
  "closed",
  "processing",
  "due",
  "overdue",
  "held",
  "upcoming",
  "failed",
];
