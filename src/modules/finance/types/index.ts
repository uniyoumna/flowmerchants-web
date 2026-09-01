// ─── Configuration queue ─────────────────────────────────────────────────────

/**
 * Where a merchant sits in the finance-configuration workflow. A merchant
 * arrives here once compliance has approved it and leaves once its financial
 * parameters are submitted.
 */
export const CONFIG_STATUSES = [
  "pending_review",
  "under_review",
  "configured",
] as const;

export type ConfigStatus = (typeof CONFIG_STATUSES)[number];

export function isConfigStatus(value: string): value is ConfigStatus {
  return (CONFIG_STATUSES as readonly string[]).includes(value);
}

export const CONFIG_SUBMISSION_TYPES = ["initial", "renewal"] as const;

export type ConfigSubmissionType = (typeof CONFIG_SUBMISSION_TYPES)[number];

export function isConfigSubmissionType(
  value: string,
): value is ConfigSubmissionType {
  return (CONFIG_SUBMISSION_TYPES as readonly string[]).includes(value);
}

/** Sentinel for "no status filter". */
export const ALL_CONFIG_STATUSES = "all";

export type ApiConfigWorkflow = {
  id: string;
  merchant_id?: string | null;
  merchant_name?: string | null;
  merchant_code?: string | null;
  business_type?: string | null;
  submission_type?: string | null;
  sla_percent?: number | string | null;
  submitted_by?: string | null;
  submitted_at?: string | null;
  status: string;
  assigned_to?: string | null;
  due_date?: string | null;
};

export type ConfigWorkflow = {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantCode: string;
  businessType: string;
  submissionType: ConfigSubmissionType;
  /** 0–100. Higher means closer to breaching the review window. */
  slaPercent: number;
  submittedBy: string;
  submittedAt: string;
  status: ConfigStatus;
  /** `null` renders as "Unassigned" — nobody has picked the workflow up. */
  assignedTo: string | null;
  dueDate: string;
};

export type ConfigQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  status: ConfigStatus | typeof ALL_CONFIG_STATUSES;
  ordering: string;
};

export type ConfigQueueResult = {
  data: ConfigWorkflow[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type ConfigOverview = {
  underReview: number;
  slaOverdue: number;
  pendingReview: number;
  expiryRisk: number;
};

// ─── Configuration review screen ─────────────────────────────────────────────

/** The compliance sign-off carried into finance, shown beside the form. */
export type ComplianceAgreementDocument = {
  name: string;
  /** Pre-formatted, e.g. `4.1 MB`. */
  sizeLabel: string;
  status: string;
  url: string | null;
};

/**
 * Everything the configuration screen needs: who is being configured, how much
 * of the review window is left, and the settings already saved for them.
 */
export type MerchantConfigDetail = {
  id: string;
  merchantId: string;
  merchantName: string;
  submissionType: ConfigSubmissionType;
  status: ConfigStatus;
  reviewDue: string;
  slaPercent: number;
  reviewerInitials: string;
  complianceAgreement: ComplianceAgreementDocument | null;
  /** Saved parameters, or `null` for a merchant not configured yet. */
  config: Record<string, unknown> | null;
};

/** Outcome of submitting a merchant's financial configuration. */
export type ConfigSubmitResult = {
  success: boolean;
  error: string | null;
};
