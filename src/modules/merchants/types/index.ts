/** The statuses the merchants list works with, in display order. */
export const MERCHANT_STATUSES = [
  "active",
  "draft",
  "pending_compliance_review",
  "pending_finance_setup",
  "blocked",
  "grace_period",
  "deactivated",
] as const;

export type MerchantStatus = (typeof MERCHANT_STATUSES)[number];

export function isMerchantStatus(value: string): value is MerchantStatus {
  return (MERCHANT_STATUSES as readonly string[]).includes(value);
}

export type ApiAssignedProduct = {
  id: number;
  loan_product_id: number;
  product_name: string;
  is_active?: boolean;
};

export type ApiMerchant = {
  id: string;
  status: MerchantStatus;
  name_en: string;
  name_ar: string;
  commercial_registration_number?: string | null;
  business_type?: string | null;
  business_type_ids?: unknown;
  assigned_products?: ApiAssignedProduct[] | null;
  acquisition_owner_name?: string | null;
  acquisition_owner?: number | null;
  active_branches?: number | null;
  max_branches?: number | null;
  approval_expiry_date?: string | null;
  created_at: string;
};

/** DRF `PageNumberPagination` envelope. */
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ─── View model ──────────────────────────────────────────────────────────────

export type Merchant = {
  id: string;
  name: string;
  arabicName: string;
  code: string | null;
  products: string[] | null;
  businessType: string;
  owner: string;
  branches: string;
  expiry: string | null;
  joiningDate: string;
  status: MerchantStatus;
};

// ─── Query params ────────────────────────────────────────────────────────────

/** Sentinel used by the status <select> to mean "no status filter". */
export const ALL_STATUSES = "all";

export type MerchantsQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  status: MerchantStatus | typeof ALL_STATUSES;
  /** DRF `ordering` value, e.g. `"name_en"` or `"-created_at"`. `""` = default. */
  ordering: string;
};

export type MerchantsListResult = {
  data: Merchant[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type MerchantsOverview = {
  total: number;
  active: number;
  pending: number;
  atRisk: number;
};

// ─── Create wizard ───────────────────────────────────────────────────────────

/**
 * The five onboarding steps, in order. The slug is what lands in the URL
 * (`/merchants/new?step=agreement`), so it is part of the public contract.
 */
export const MERCHANT_CREATE_STEPS = [
  "general",
  "agreement",
  "contacts",
  "bank",
  "commercial",
] as const;

export type MerchantCreateStep = (typeof MERCHANT_CREATE_STEPS)[number];

export function isMerchantCreateStep(
  value: string,
): value is MerchantCreateStep {
  return (MERCHANT_CREATE_STEPS as readonly string[]).includes(value);
}

/** Drives the tick / ring / dot rendered by the stepper. */
export type MerchantStepState = "completed" | "current" | "pending";

export type MerchantCreateQueryParams = {
  step: MerchantCreateStep;
  /**
   * Draft the wizard is editing. `null` on a brand-new merchant — the backend
   * assigns the immutable merchant ID when step 1 is first saved (FE-004).
   */
  draftId: string | null;
};

/** What a step section hands its form: saved values, or `null` for a fresh step. */
export type MerchantStepData = Record<string, unknown> | null;

/** Uniform result of every step save — never throws, always tells the UI what to do. */
export type MerchantStepSaveResult = {
  success: boolean;
  /** Echoed back so the wizard can pin a newly created draft to the URL. */
  draftId: string | null;
  message: string | null;
  /** Field-level backend errors, keyed by form field name (FE-079). */
  fieldErrors?: Record<string, string>;
};

/**
 * Result of submitting the finished application for compliance review (FE-051).
 * `missingSteps` is populated when the draft fails the completeness check
 * (FE-035), so the UI can name the steps that still need filling in.
 */
export type MerchantSubmitResult = {
  success: boolean;
  message: string | null;
  missingSteps?: MerchantCreateStep[];
};

/**
 * Step 1 as the backend stores it. Files come back as URLs on read and go up as
 * `File` parts on write, which is why the mapper handles each direction apart.
 */
export interface ApiMerchantGeneralInfo {
  logo: string | null;
  commercial_name_en: string | null;
  commercial_name_ar: string | null;

  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_mobile: string | null;
  primary_contact_landline: string | null;
  website: string | null;
  mobile_app_deep_link: string | null;

  governorate: string | null;
  city: string | null;
  area: string | null;
  full_address: string | null;

  business_types: string[] | null;
  assigned_products: string[] | null;

  name_en: string | null;
  name_ar: string | null;
  commercial_registration_number: string | null;
  vat_number: string | null;
  cr_document: string | null;
  vat_certificate: string | null;
}

/** Step 2 — Agreement (FE-033). */
export interface ApiMerchantAgreement {
  signed_agreement: string | null;
  agreement_reference: string | null;
  signature_date: string | null;
  effective_date: string | null;
}

/** Step 3 — Operational contacts (FE-021, FE-022). */
export interface ApiMerchantContacts {
  finance_contact_email: string | null;
  escalation_contacts: unknown;
  account_managers: unknown;
}

/** Step 4 — Settlement bank accounts (FE-039, FE-040). */
export interface ApiMerchantBankAccounts {
  bank_accounts: unknown;
}

/** Step 5 — Commercial configuration (FE-024). */
export interface ApiMerchantCommercialConfig {
  currency: string | null;
  min_ticket_size: string | null;
  max_ticket_size: string | null;
  max_branches: string | null;
  max_sales_persons: string | null;
}

// ─── Merchant detail ─────────────────────────────────────────────────────────

/** Tabs on the merchant detail screen; the slug lands in `?tab=`. */
export const MERCHANT_DETAIL_TABS = [
  "overview",
  "financials",
  "risk",
  "branches",
] as const;

export type MerchantDetailTab = (typeof MERCHANT_DETAIL_TABS)[number];

export function isMerchantDetailTab(value: string): value is MerchantDetailTab {
  return (MERCHANT_DETAIL_TABS as readonly string[]).includes(value);
}

export type MerchantTeamMember = {
  name: string;
  role: string;
  /** Two-letter monogram for the avatar. */
  initials: string;
};

/** Everything the detail header and Overview tab render. */
export type MerchantDetail = {
  id: string;
  /** Human-facing merchant code, e.g. `MCH-10042`. */
  code: string;
  name: string;
  arabicName: string;
  initials: string;
  status: MerchantStatus;
  registrationNumber: string | null;
  businessType: string;
  products: string[];
  activeBranches: number;
  maxBranches: number | null;
  contractExpiry: string | null;
  renewalState: string;
  walletBalance: number;
  pendingSettlement: number;
  totalPurchases: number;
  currency: string;
  team: MerchantTeamMember[];
};

export const SETTLEMENT_STATUSES = [
  "upcoming",
  "due",
  "processing",
  "held",
  "failed",
  "overdue",
  "closed",
] as const;

export type SettlementStatus = (typeof SETTLEMENT_STATUSES)[number];

export type MerchantTransaction = {
  id: string;
  branch: string;
  customer: string;
  type: "purchase" | "refund";
  amount: number;
  date: string;
};

export type MerchantSettlementTicket = {
  id: string;
  period: string;
  gross: number;
  refunds: number;
  fees: number;
  net: number;
  dueDate: string;
  status: SettlementStatus;
};

export type MerchantFinancials = {
  gross: number;
  netDisbursed: number;
  totalRefunds: number;
  tickets: MerchantSettlementTicket[];
};

export const RISK_FLAG_STATUSES = [
  "open",
  "under_review",
  "resolved",
  "dismissed",
  "reopened",
] as const;

export type RiskFlagStatus = (typeof RISK_FLAG_STATUSES)[number];

export type MerchantRiskFlag = {
  id: string;
  metric: string;
  severity: "low" | "medium" | "high";
  status: RiskFlagStatus;
  observed: string;
  detectedAt: string;
};

export type MerchantRiskSummary = {
  open: number;
  highSeverity: number;
  underReview: number;
  flags: MerchantRiskFlag[];
};

export type MerchantBranchSummary = {
  id: string;
  name: string;
  code: string;
  city: string;
  transactions: number;
  isActive: boolean;
};

/** Counts shown as tab badges — resolved with the merchant so tabs never flicker. */
export type MerchantDetailCounts = {
  financials: number;
  risk: number;
  branches: number;
};

/**
 * The merchant detail endpoint returns the list row plus the fields only the
 * detail screen needs. Everything extra is optional so a backend that has not
 * shipped a field yet degrades to a placeholder rather than breaking the page.
 */
export type ApiMerchantDetail = ApiMerchant & {
  merchant_code?: string | null;
  compliance_owner_name?: string | null;
  renewal_state?: string | null;
  currency?: string | null;
  wallet_balance?: number | string | null;
  pending_settlement?: number | string | null;
  total_purchases?: number | string | null;
};

// ─── Compliance queue ────────────────────────────────────────────────────────

/**
 * Where a submission sits in the compliance workflow. Only the first three are
 * ever queued — an approved or rejected case leaves the queue, but the states
 * exist so a decided case still renders correctly if one is opened directly.
 */
export const COMPLIANCE_STATUSES = [
  "pending_review",
  "under_review",
  "returned",
  "approved",
  "rejected",
] as const;

export type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

export function isComplianceStatus(value: string): value is ComplianceStatus {
  return (COMPLIANCE_STATUSES as readonly string[]).includes(value);
}

/** A first-time application versus a contract renewal. */
export const COMPLIANCE_SUBMISSION_TYPES = ["initial", "renewal"] as const;

export type ComplianceSubmissionType =
  (typeof COMPLIANCE_SUBMISSION_TYPES)[number];

export function isComplianceSubmissionType(
  value: string,
): value is ComplianceSubmissionType {
  return (COMPLIANCE_SUBMISSION_TYPES as readonly string[]).includes(value);
}

export type ApiComplianceCase = {
  id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_code?: string | null;
  business_type?: string | null;
  submission_type?: string | null;
  /** Share of the review window already elapsed, 0–100. */
  sla_percent?: number | string | null;
  submitted_by?: string | null;
  submitted_at?: string | null;
  status: string;
  assigned_to?: string | null;
  due_date?: string | null;
};

export type ComplianceCase = {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantCode: string;
  businessType: string;
  submissionType: ComplianceSubmissionType;
  /** 0–100. Higher means closer to breaching the SLA. */
  slaPercent: number;
  submittedBy: string;
  submittedAt: string;
  status: ComplianceStatus;
  /** `null` renders as "Unassigned" — nobody has picked the case up yet. */
  assignedTo: string | null;
  dueDate: string;
};

export type ComplianceQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  status: ComplianceStatus | typeof ALL_STATUSES;
  ordering: string;
};

export type ComplianceQueueResult = {
  data: ComplianceCase[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type ComplianceOverview = {
  underReview: number;
  slaOverdue: number;
  pendingReview: number;
  expiryRisk: number;
};

// ─── Compliance review screen ────────────────────────────────────────────────

/**
 * The review sections, in order. They mirror the five onboarding steps: a
 * reviewer reads back exactly what the merchant submitted, so the sections and
 * `MERCHANT_CREATE_STEPS` stay aligned. The slug lands in the URL.
 */
export const COMPLIANCE_REVIEW_SECTIONS = [
  "general",
  "agreement",
  "contacts",
  "bank",
  "commercial",
] as const;

export type ComplianceReviewSection =
  (typeof COMPLIANCE_REVIEW_SECTIONS)[number];

export function isComplianceReviewSection(
  value: string,
): value is ComplianceReviewSection {
  return (COMPLIANCE_REVIEW_SECTIONS as readonly string[]).includes(value);
}

/** An uploaded file as the reviewer sees it — never the bytes, just the card. */
export type ReviewDocument = {
  name: string;
  /** Pre-formatted, e.g. `5.3 MB` — the mapper owns the unit maths. */
  sizeLabel: string;
  /** Drives the coloured extension chip. */
  kind: "pdf" | "image" | "doc";
  url: string | null;
};

export type ComplianceReviewGeneral = {
  commercialNameEn: string;
  commercialNameAr: string;
  logo: ReviewDocument | null;
  primaryContactName: string;
  email: string;
  mobileNumber: string;
  landline: string;
  website: string;
  mobileAppDeepLink: string;
  governorate: string;
  city: string;
  area: string;
  fullAddress: string;
  businessTypes: string[];
  financingType: string;
  registeredNameEn: string;
  registeredNameAr: string;
  crNumber: string;
  vatNumber: string;
  crDocument: ReviewDocument | null;
  vatCertificate: ReviewDocument | null;
};

export type ComplianceReviewAgreement = {
  signedAgreement: ReviewDocument | null;
  agreementReference: string;
  signatureDate: string;
  effectiveDate: string;
};

export type ComplianceReviewEscalationContact = {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  level: string;
};

export type ComplianceReviewAccountManager = {
  fullName: string;
  email: string;
  phone: string;
  isPrimary: boolean;
};

export type ComplianceReviewContacts = {
  financeEmail: string;
  escalationContacts: ComplianceReviewEscalationContact[];
  accountManagers: ComplianceReviewAccountManager[];
};

export type ComplianceReviewBankAccount = {
  id: string;
  bankName: string;
  bankBranch: string;
  accountHolderName: string;
  accountType: string;
  phone: string;
  country: string;
  currency: string;
  swift: string;
  /** Already masked by the mapper — full numbers never reach the client. */
  accountNumber: string;
  iban: string;
  isDefault: boolean;
  isFrozen: boolean;
};

export type ComplianceReviewCommercial = {
  minTicketSize: string;
  maxTicketSize: string;
  currency: string;
  maxBranches: string;
  maxSalesPersons: string;
};

export type ComplianceReviewDetail = {
  id: string;
  merchantId: string;
  merchantName: string;
  submissionType: ComplianceSubmissionType;
  status: ComplianceStatus;
  reviewDue: string;
  slaPercent: number;
  reviewerInitials: string;
  general: ComplianceReviewGeneral;
  agreement: ComplianceReviewAgreement;
  contacts: ComplianceReviewContacts;
  bankAccounts: ComplianceReviewBankAccount[];
  commercial: ComplianceReviewCommercial;
};

/** Outcome of an approve / reject decision on a compliance case. */
export type ComplianceDecisionResult = {
  success: boolean;
  error: string | null;
};
