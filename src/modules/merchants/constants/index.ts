/** Constants for the merchants module. */
import { ALL_STATUSES, MERCHANT_STATUSES, type MerchantStatus } from "../types";

/** Backend status code → human label, straight from the enum's description. */
export const MERCHANT_STATUS_LABELS: Record<MerchantStatus, string> = {
  active: "Active",
  draft: "Draft",
  pending_compliance_review: "Pending Compliance",
  pending_finance_setup: "Pending Finance",
  blocked: "Blocked",
  grace_period: "Grace Period",
  deactivated: "Deactivated",
};

export const MERCHANT_STATUS_STYLES: Record<MerchantStatus, string> = {
  active: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
  blocked: "bg-rose-50 text-rose-600 border border-rose-100/60",
  grace_period: "bg-amber-50 text-amber-700 border border-amber-100/60",
  pending_compliance_review:
    "bg-orange-50 text-orange-700 border border-orange-100/60",
  pending_finance_setup:
    "bg-orange-50 text-orange-700 border border-orange-100/60",
  draft: "bg-slate-100 text-slate-600 border border-slate-200/60",
  deactivated: "bg-slate-100 text-slate-500 border border-slate-200/60",
};

/**
 * Status buckets summed for the "pending action" / "at risk" KPI cards. These are
 * raw count keys, not `MerchantStatus`: the overview endpoint still reports the
 * lifecycle states the list itself does not surface.
 */
export const PENDING_STATUSES: string[] = [
  "pending_compliance_review",
  "pending_finance_setup",
  "pending_final_compliance_approval",
  "returned",
];

export const AT_RISK_STATUSES: string[] = [
  "blocked",
  "suspended",
  "grace_period",
  "expired",
  "rejected",
];

export const MERCHANT_STATUS_OPTIONS = [
  { label: "All Statuses", value: ALL_STATUSES },
  ...MERCHANT_STATUSES.map((status) => ({
    label: MERCHANT_STATUS_LABELS[status],
    value: status,
  })),
];

/* ─── Merchants list screen ─── */

export const DEFAULT_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;

/** URL query keys — shared by the page (server) and the filter bar (client). */
export const MERCHANTS_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;

/** Sentinel for "no explicit ordering" — `BaseSelect` cannot hold an empty value. */
export const DEFAULT_ORDERING = "none";

/**
 * Values map 1:1 onto the DRF `ordering` query param. Only these three fields
 * are supported for ordering, so nothing else is offered.
 */
export const MERCHANT_SORT_OPTIONS = [
  { label: "Sort by", value: DEFAULT_ORDERING },
  { label: "Name", value: "name_en" },
  { label: "Joining Date", value: "created_at" },
  { label: "Status", value: "status" },
];
