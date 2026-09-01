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

// ─── Merchant wallet ─────────────────────────────────────────────────────────

/**
 * Why a wallet can or cannot move money. Only `active` and `grace_period`
 * merchants hold a spendable balance; the rest are blocked earlier in the
 * lifecycle, which is why their wallets read zero rather than empty.
 */
export const WALLET_STATUSES = [
  "active",
  "grace_period",
  "blocked",
  "pending_compliance",
  "pending_finance",
  "no_eligible_branch",
  "deactivated",
  "draft",
] as const;

export type WalletStatus = (typeof WALLET_STATUSES)[number];

export function isWalletStatus(value: string): value is WalletStatus {
  return (WALLET_STATUSES as readonly string[]).includes(value);
}

/** A movement in or out of the wallet. */
export const WALLET_ENTRY_TYPES = ["income", "outcome"] as const;

export type WalletEntryType = (typeof WALLET_ENTRY_TYPES)[number];

export function isWalletEntryType(value: string): value is WalletEntryType {
  return (WALLET_ENTRY_TYPES as readonly string[]).includes(value);
}

/** One merchant in the wallet picker. */
export type WalletMerchantOption = {
  merchantId: string;
  merchantName: string;
  merchantCode: string;
};

export type WalletLedgerEntry = {
  id: string;
  date: string;
  description: string;
  type: WalletEntryType;
  /** Always positive; `type` carries the direction. */
  amount: number;
  balanceAfter: number;
};

export type MerchantWallet = {
  merchantId: string;
  merchantName: string;
  merchantCode: string;
  status: WalletStatus;
  balance: number;
  /** Summed from the ledger, so the cards cannot contradict the movements. */
  totalIncome: number;
  totalOutcome: number;
  pendingSettlement: number;
  /** `balance / (balance + pending)` as a whole percent, 0 when both are zero. */
  utilisation: number;
  currency: string;
  ledger: WalletLedgerEntry[];
};

export type WalletResult = {
  data: MerchantWallet | null;
  merchants: WalletMerchantOption[];
  error: string | null;
};
