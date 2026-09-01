/** Constants for the risk flags module. */
import {
  ALL_RISK_FLAGS,
  type RiskFlagSeverity,
  type RiskFlagStatus,
  type RiskFlagTab,
  type RiskFlagType,
} from "../types";

export const RISK_FLAG_STATUS_LABELS: Record<RiskFlagStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export const RISK_FLAG_STATUS_STYLES: Record<RiskFlagStatus, string> = {
  open: "bg-rose-100 text-rose-600",
  under_review: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  dismissed: "bg-slate-100 text-slate-500",
};

export const RISK_FLAG_SEVERITY_LABELS: Record<RiskFlagSeverity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const RISK_FLAG_SEVERITY_STYLES: Record<RiskFlagSeverity, string> = {
  high: "bg-rose-100 text-rose-600",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-amber-50 text-amber-600",
};

export const RISK_FLAG_TYPE_LABELS: Record<RiskFlagType, string> = {
  purchase_spike: "Purchase Spike",
  refund_spike: "Refund Spike",
  chargeback_spike: "Chargeback Spike",
};

/**
 * The type is coloured text rather than a badge: the row already carries a
 * severity and a status pill, and a third filled chip made rows unreadable.
 */
export const RISK_FLAG_TYPE_STYLES: Record<RiskFlagType, string> = {
  purchase_spike: "text-orange-500",
  refund_spike: "text-rose-500",
  chargeback_spike: "text-amber-600",
};

/** Tab captions. "All" is the sentinel; the rest reuse the status labels. */
export const RISK_FLAG_TAB_LABELS: Record<RiskFlagTab, string> = {
  [ALL_RISK_FLAGS]: "All",
  open: RISK_FLAG_STATUS_LABELS.open,
  under_review: RISK_FLAG_STATUS_LABELS.under_review,
  resolved: RISK_FLAG_STATUS_LABELS.resolved,
  dismissed: RISK_FLAG_STATUS_LABELS.dismissed,
};

/**
 * Only a live case can be acted on. A resolved or dismissed case is closed, so
 * it shows no row actions.
 */
export const ACTIONABLE_STATUSES: RiskFlagStatus[] = ["open", "under_review"];

/* ─── Risk flags list screen ─── */

export const RISK_FLAGS_PAGE_SIZE = 25;

/** URL query keys — shared by the page (server) and the tabs (client). */
export const RISK_FLAGS_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;
