/** Constants for the finance module. */
import {
  ALL_CONFIG_STATUSES,
  type ConfigStatus,
  type ConfigSubmissionType,
} from "../types";

export const CONFIG_STATUS_LABELS: Record<ConfigStatus, string> = {
  pending_review: "Pending Review",
  under_review: "Under Review",
  configured: "Configured",
};

export const CONFIG_STATUS_STYLES: Record<ConfigStatus, string> = {
  pending_review: "bg-amber-50 text-amber-700 border border-amber-100/60",
  under_review: "bg-purple-50 text-[#7C3AED] border border-purple-100/60",
  configured: "bg-emerald-50 text-emerald-700 border border-emerald-100/60",
};

export const CONFIG_SUBMISSION_TYPE_LABELS: Record<
  ConfigSubmissionType,
  string
> = {
  initial: "Initial Submission",
  renewal: "Renewal",
};

export const CONFIG_STATUS_OPTIONS = [
  { label: "All Statuses", value: ALL_CONFIG_STATUSES },
  { label: CONFIG_STATUS_LABELS.pending_review, value: "pending_review" },
  { label: CONFIG_STATUS_LABELS.under_review, value: "under_review" },
];

/** Sentinel for "no explicit ordering" — `BaseSelect` cannot hold an empty value. */
export const CONFIG_DEFAULT_ORDERING = "none";

/** Values map 1:1 onto the DRF `ordering` param. */
export const CONFIG_SORT_OPTIONS = [
  { label: "Sort by", value: CONFIG_DEFAULT_ORDERING },
  { label: "Submit Date", value: "-submitted_at" },
  { label: "SLA %", value: "-sla_percent" },
  { label: "Due Date", value: "due_date" },
];

/* ─── Configuration queue screen ─── */

export const CONFIG_PAGE_SIZE = 10;
export const CONFIG_SEARCH_DEBOUNCE_MS = 350;

export const CONFIG_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;

/* ─── Configuration form ─── */

export const CYCLE_TYPE_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Instant", value: "instant" },
];

export const CYCLE_FREQUENCY_OPTIONS = [
  { label: "Once", value: "once" },
  { label: "Multiple", value: "multiple" },
];

export const FEE_TYPE_OPTIONS = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

export const FEE_COLLECTED_FROM_OPTIONS = [
  { label: "Customer", value: "customer" },
  { label: "Merchant", value: "merchant" },
];

export const CAP_PERIOD_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Refund Window", value: "refund_window" },
  { label: "Month", value: "month" },
];

export const REFUND_TYPE_OPTIONS = [
  { label: "Full Refund", value: "full" },
  { label: "Partial Refund", value: "partial" },
];

export const REBATE_STRUCTURE_OPTIONS = [
  { label: "Fixed", value: "fixed" },
  { label: "Slab", value: "slab" },
];

export const REBATE_VALUE_TYPE_OPTIONS = [
  { label: "Fixed", value: "fixed" },
  { label: "Percentage", value: "percentage" },
];

/**
 * The three permissions at the bottom of the form. Each one lets the merchant
 * charge the customer something extra, so each is off unless finance grants it.
 */
export const FEE_ELIGIBILITY_TOGGLES = [
  {
    name: "downPayment",
    title: "Down-payment",
    description: "Merchant can collect down-payment upfront",
  },
  {
    name: "upfrontAdminFees",
    title: "Upfront Admin Fees",
    description: "Merchant can charge admin fees at contract start",
  },
  {
    name: "cancellationFees",
    title: "Cancellation Fees",
    description: "Merchant can apply fees on order cancellation",
  },
] as const;

/* ─── Merchant wallet screen ─── */

import type { WalletEntryType, WalletStatus } from "../types";

export const WALLET_STATUS_LABELS: Record<WalletStatus, string> = {
  active: "Active",
  grace_period: "Grace Period",
  blocked: "Blocked",
  pending_compliance: "Pending Compliance",
  pending_finance: "Pending Finance",
  no_eligible_branch: "No Eligible Branch",
  deactivated: "Deactivated",
  draft: "Draft",
};

/** `surface` tints the pill; `dot` colours the status light inside it. */
export const WALLET_STATUS_STYLES: Record<
  WalletStatus,
  { surface: string; dot: string }
> = {
  active: { surface: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  grace_period: { surface: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  blocked: { surface: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
  pending_compliance: {
    surface: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  pending_finance: {
    surface: "bg-purple-50 text-[#7C3AED]",
    dot: "bg-[#7C3AED]",
  },
  no_eligible_branch: {
    surface: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },
  deactivated: { surface: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
  draft: { surface: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export const WALLET_ENTRY_TYPE_LABELS: Record<WalletEntryType, string> = {
  income: "Income",
  outcome: "Outcome",
};

export const WALLET_ENTRY_TYPE_STYLES: Record<WalletEntryType, string> = {
  income: "bg-emerald-50 text-emerald-700",
  outcome: "bg-rose-50 text-rose-600",
};

/** URL query key — which merchant's wallet is on screen. */
export const WALLET_QUERY_KEYS = {
  merchant: "merchant",
} as const;

/** Shown beside the ledger count; a merchant starts with an empty wallet. */
export const WALLET_DEFAULT_BALANCE_NOTE =
  "Default balance: EGP 0 for new merchants";
