// ─── API shapes ──────────────────────────────────────────────────────────────

export type ApiRiskFlagCase = {
  id: string;
  case_id?: string | null;
  merchant_id?: string | null;
  merchant_name?: string | null;
  merchant_code?: string | null;
  branch_name?: string | null;
  type: string;
  metric?: string | null;
  observed_value?: number | string | null;
  /** Unit shown beside the value, e.g. `EGP`, `refunds`, `transactions`. */
  observed_unit?: string | null;
  threshold?: string | null;
  severity: string;
  status: string;
  detected_at?: string | null;
  assigned_to?: string | null;
  /** Whether the merchant behind this case is currently blocked. */
  entity_blocked?: boolean | null;
};

// ─── View model ──────────────────────────────────────────────────────────────

export const RISK_FLAG_STATUSES = [
  "open",
  "under_review",
  "resolved",
  "dismissed",
] as const;

export type RiskFlagStatus = (typeof RISK_FLAG_STATUSES)[number];

export function isRiskFlagStatus(value: string): value is RiskFlagStatus {
  return (RISK_FLAG_STATUSES as readonly string[]).includes(value);
}

export const RISK_FLAG_SEVERITIES = ["high", "medium", "low"] as const;

export type RiskFlagSeverity = (typeof RISK_FLAG_SEVERITIES)[number];

export function isRiskFlagSeverity(value: string): value is RiskFlagSeverity {
  return (RISK_FLAG_SEVERITIES as readonly string[]).includes(value);
}

/** What tripped the rule. Drives the coloured type label in the table. */
export const RISK_FLAG_TYPES = [
  "purchase_spike",
  "refund_spike",
  "chargeback_spike",
] as const;

export type RiskFlagType = (typeof RISK_FLAG_TYPES)[number];

export function isRiskFlagType(value: string): value is RiskFlagType {
  return (RISK_FLAG_TYPES as readonly string[]).includes(value);
}

/** Sentinel for the "All" tab — no status filter is sent to the backend. */
export const ALL_RISK_FLAGS = "all";

export const RISK_FLAG_TABS = [ALL_RISK_FLAGS, ...RISK_FLAG_STATUSES] as const;

export type RiskFlagTab = (typeof RISK_FLAG_TABS)[number];

export function isRiskFlagTab(value: string): value is RiskFlagTab {
  return (RISK_FLAG_TABS as readonly string[]).includes(value);
}

export type RiskFlagCase = {
  id: string;
  /** Human-facing reference, e.g. `RF-20250106-003`. */
  caseId: string;
  merchantId: string;
  merchantName: string;
  merchantCode: string;
  /** Empty when the rule tripped across the merchant rather than one branch. */
  branchName: string;
  type: RiskFlagType;
  /** What was measured, e.g. `Purchase Amount (Daily)`. */
  metric: string;
  /** Pre-formatted with its unit, e.g. `EGP 148,200` or `84 refunds`. */
  observed: string;
  /** How far past the rule it went, e.g. `+280% vs. 30-day avg`. */
  threshold: string;
  severity: RiskFlagSeverity;
  status: RiskFlagStatus;
  detectedAt: string;
  /** `null` renders as unassigned — no officer has picked the case up. */
  assignedTo: string | null;
  entityBlocked: boolean;
};

// ─── Query params and results ────────────────────────────────────────────────

export type RiskFlagsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  status: RiskFlagTab;
  ordering: string;
};

export type RiskFlagsListResult = {
  data: RiskFlagCase[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type RiskFlagsOverview = {
  openFlags: number;
  underReview: number;
  /** Counted across every status, not just the open ones. */
  highSeverity: number;
  blockedMerchants: number;
};

/** Outcome of blocking a merchant or resolving a case. */
export type RiskFlagActionResult = {
  success: boolean;
  error: string | null;
};
