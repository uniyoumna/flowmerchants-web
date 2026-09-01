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

/* ─── Create merchant wizard ─── */

import type { SelectOption } from "@/components/base/BaseSelect";
import { MERCHANT_CREATE_STEPS, type MerchantCreateStep } from "../types";

/** URL query keys for the wizard — shared by the route, stepper and footer. */
export const MERCHANT_CREATE_QUERY_KEYS = {
  step: "step",
  draftId: "draftId",
} as const;

export const FIRST_MERCHANT_CREATE_STEP: MerchantCreateStep =
  MERCHANT_CREATE_STEPS[0];

type MerchantStepMeta = {
  /** 1-based position rendered as "STEP n". */
  order: number;
  /** Short label shown in the stepper rail. */
  label: string;
  /** Heading above the step body. */
  title: string;
  /** Sub-heading under the step title. */
  description: string;
};

export const MERCHANT_STEP_META: Record<MerchantCreateStep, MerchantStepMeta> =
  {
    general: {
      order: 1,
      label: "General Information",
      title: "General Information",
      description: "Complete this step to proceed",
    },
    agreement: {
      order: 2,
      label: "Agreement",
      title: "Agreement",
      description: "Upload and fill in the merchant agreement details",
    },
    contacts: {
      order: 3,
      label: "Operational Contacts",
      title: "Operational Contacts",
      description: "Finance, escalation and account-manager contacts",
    },
    bank: {
      order: 4,
      label: "Bank Accounts",
      title: "Bank Accounts",
      description: "Register the settlement bank accounts",
    },
    commercial: {
      order: 5,
      label: "Commercial Config",
      title: "Commercial Config",
      description: "Ticket limits and operating capacity",
    },
  };

/* ─── Upload rules (FE-023, FE-036) ─── */

export const MAX_UPLOAD_SIZE_MB = 5;
export const IMAGE_UPLOAD_ACCEPT = "image/png,image/jpeg";
export const DOCUMENT_UPLOAD_ACCEPT = "image/png,image/jpeg,application/pdf";

/* ─── Address master data ─── */

// TODO: replace with GET /api/v1/masters/governorates/ once the endpoint lands.
export const GOVERNORATE_OPTIONS: SelectOption[] = [
  { label: "Cairo", value: "cairo" },
  { label: "Giza", value: "giza" },
  { label: "Alexandria", value: "alexandria" },
];

// TODO: replace with GET /api/v1/masters/cities/?governorate={id}.
export const CITY_OPTIONS_BY_GOVERNORATE: Record<string, SelectOption[]> = {
  cairo: [
    { label: "Nasr City", value: "nasr-city" },
    { label: "Maadi", value: "maadi" },
    { label: "Heliopolis", value: "heliopolis" },
  ],
  giza: [
    { label: "Dokki", value: "dokki" },
    { label: "6th of October", value: "6th-of-october" },
  ],
  alexandria: [
    { label: "Smouha", value: "smouha" },
    { label: "Miami", value: "miami" },
  ],
};

// TODO: replace with GET /api/v1/masters/areas/?city={id}.
export const AREA_OPTIONS_BY_CITY: Record<string, SelectOption[]> = {
  "nasr-city": [
    { label: "Zone 1", value: "nasr-city-zone-1" },
    { label: "Zone 6", value: "nasr-city-zone-6" },
  ],
  maadi: [
    { label: "Degla", value: "maadi-degla" },
    { label: "Sarayat", value: "maadi-sarayat" },
  ],
  heliopolis: [
    { label: "Korba", value: "heliopolis-korba" },
    { label: "Almaza", value: "heliopolis-almaza" },
  ],
  dokki: [
    { label: "Mesaha", value: "dokki-mesaha" },
    { label: "Tahrir", value: "dokki-tahrir" },
  ],
  "6th-of-october": [
    { label: "District 1", value: "october-district-1" },
    { label: "District 7", value: "october-district-7" },
  ],
  smouha: [
    { label: "Green Plaza", value: "smouha-green-plaza" },
    { label: "Fawzy Moaz", value: "smouha-fawzy-moaz" },
  ],
  miami: [
    { label: "Miami Beach", value: "miami-beach" },
    { label: "Sidi Bishr", value: "miami-sidi-bishr" },
  ],
};

/* ─── Classification master data ─── */

// TODO: replace with GET /api/v1/masters/business-types/ (FE-018).
export const BUSINESS_TYPE_OPTIONS: SelectOption[] = [
  { label: "Retail", value: "retail" },
  { label: "Electronics", value: "electronics" },
  { label: "Furniture", value: "furniture" },
  { label: "Automotive", value: "automotive" },
  { label: "Healthcare", value: "healthcare" },
];

// TODO: replace with GET /api/v1/products/loan-products/?is_active=true (FE-019).
export const LOAN_PRODUCT_OPTIONS: SelectOption[] = [
  { label: "Consumer Finance", value: "consumer-finance" },
  { label: "Auto Finance", value: "auto-finance" },
  { label: "Home Improvement", value: "home-improvement" },
  { label: "Education Finance", value: "education-finance" },
];

/* ─── Operational contacts (step 3) ─── */

/** Escalation tiers for complaint contacts (FE-021). */
export const ESCALATION_LEVEL_OPTIONS: SelectOption[] = [1, 2, 3, 4, 5].map(
  (level) => ({ label: String(level), value: String(level) }),
);

/* ─── Bank accounts (step 4) ─── */

// TODO: replace with GET /api/v1/masters/banks/ (FE-041).
export const BANK_OPTIONS: SelectOption[] = [
  { label: "National Bank of Egypt", value: "nbe" },
  { label: "Banque Misr", value: "banque-misr" },
  { label: "Commercial International Bank", value: "cib" },
  { label: "QNB Alahli", value: "qnb-alahli" },
  { label: "Bank of Alexandria", value: "alexbank" },
];

// TODO: replace with GET /api/v1/masters/countries/ (FE-041).
export const BANK_COUNTRY_OPTIONS: SelectOption[] = [
  { label: "Egypt", value: "EG" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "Saudi Arabia", value: "SA" },
];

// TODO: replace with GET /api/v1/masters/currencies/ (FE-041).
export const CURRENCY_OPTIONS: SelectOption[] = [
  { label: "EGP", value: "EGP" },
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
];

/** FE-074 — EGP is the Egyptian deployment's default wallet currency. */
export const DEFAULT_CURRENCY = "EGP";

// TODO: replace with GET /api/v1/masters/account-types/ (FE-041).
export const BANK_ACCOUNT_TYPE_OPTIONS: SelectOption[] = [
  { label: "Current", value: "current" },
  { label: "Savings", value: "savings" },
  { label: "Corporate", value: "corporate" },
];

export const DEFAULT_BANK_ACCOUNT_TYPE = "current";

/**
 * FE-043 — with secure confirmation enabled, Account Number and IBAN
 * confirmation fields reject paste and autofill so a mistyped or substituted
 * value cannot be copied straight across from the field above.
 */
export const SECURE_ACCOUNT_CONFIRMATION = true;

/* ─── Merchant detail screen ─── */

import type {
  MerchantDetailTab,
  RiskFlagStatus,
  SettlementStatus,
} from "../types";

export const MERCHANT_DETAIL_QUERY_KEYS = { tab: "tab" } as const;

export const MERCHANT_DETAIL_TAB_LABELS: Record<MerchantDetailTab, string> = {
  overview: "Overview",
  financials: "Financials",
  risk: "Risk Flags",
  branches: "Branches",
};

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  upcoming: "Upcoming",
  due: "Due",
  processing: "Processing",
  held: "Held",
  failed: "Failed",
  overdue: "Overdue",
  closed: "Closed",
};

export const SETTLEMENT_STATUS_STYLES: Record<SettlementStatus, string> = {
  upcoming: "bg-slate-100 text-slate-600 border border-slate-200/60",
  due: "bg-amber-50 text-amber-700 border border-amber-100/60",
  processing: "bg-purple-50 text-[#7C3AED] border border-purple-100/60",
  held: "bg-orange-50 text-orange-700 border border-orange-100/60",
  failed: "bg-rose-50 text-rose-600 border border-rose-100/60",
  overdue: "bg-rose-50 text-rose-600 border border-rose-100/60",
  closed: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
};

export const RISK_FLAG_STATUS_LABELS: Record<RiskFlagStatus, string> = {
  open: "Open",
  under_review: "Under Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
  reopened: "Reopened",
};

export const RISK_FLAG_STATUS_STYLES: Record<RiskFlagStatus, string> = {
  open: "bg-rose-50 text-rose-600 border border-rose-100/60",
  under_review: "bg-amber-50 text-amber-700 border border-amber-100/60",
  resolved: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
  dismissed: "bg-slate-100 text-slate-500 border border-slate-200/60",
  reopened: "bg-orange-50 text-orange-700 border border-orange-100/60",
};

/* ─── Compliance queue screen ─── */

import {
  ALL_STATUSES as ALL_COMPLIANCE_STATUSES,
  COMPLIANCE_REVIEW_SECTIONS,
  COMPLIANCE_STATUSES,
  type ComplianceReviewSection,
  type ComplianceStatus,
  type ComplianceSubmissionType,
} from "../types";

export const COMPLIANCE_PAGE_SIZE = 10;

/** URL query keys — shared by the queue page (server) and its filter bar. */
export const COMPLIANCE_QUERY_KEYS = {
  search: "search",
  status: "status",
  ordering: "ordering",
  page: "page",
  pageSize: "page_size",
} as const;

/** URL query key for the review screen's active section. */
export const COMPLIANCE_REVIEW_QUERY_KEYS = {
  section: "section",
} as const;

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  pending_review: "Pending Review",
  under_review: "Under Review",
  returned: "Returned",
  approved: "Approved",
  rejected: "Rejected",
};

/**
 * The queue prints its status as coloured text rather than a filled pill — the
 * SLA bar is the row's loud element, and two competing badges made rows noisy.
 */
export const COMPLIANCE_STATUS_STYLES: Record<ComplianceStatus, string> = {
  pending_review: "text-amber-600",
  under_review: "text-[#7C3AED]",
  returned: "text-orange-600",
  approved: "text-emerald-600",
  rejected: "text-rose-600",
};

export const COMPLIANCE_SUBMISSION_TYPE_LABELS: Record<
  ComplianceSubmissionType,
  string
> = {
  initial: "Initial Submission",
  renewal: "Renewal",
};

export const COMPLIANCE_STATUS_OPTIONS = [
  { label: "All Statuses", value: ALL_COMPLIANCE_STATUSES },
  ...COMPLIANCE_STATUSES.map((status) => ({
    label: COMPLIANCE_STATUS_LABELS[status],
    value: status,
  })),
];

/** Values map 1:1 onto the DRF `ordering` param. */
export const COMPLIANCE_SORT_OPTIONS = [
  { label: "Sort by", value: DEFAULT_ORDERING },
  { label: "SLA", value: "-sla_percent" },
  { label: "Submit Date", value: "-submitted_at" },
  { label: "Due Date", value: "due_date" },
];

export const COMPLIANCE_REVIEW_SECTION_LABELS: Record<
  ComplianceReviewSection,
  string
> = {
  general: "General Information",
  agreement: "Agreement",
  contacts: "Operational Contacts",
  bank: "Bank Accounts",
  commercial: "Commercial Config",
};

/** Section order for the review sidebar — the tuple is the source of truth. */
export const COMPLIANCE_REVIEW_SECTION_ORDER = COMPLIANCE_REVIEW_SECTIONS;

/**
 * SLA bar colour thresholds. Amber from 75% of the window spent, rose once the
 * SLA is blown — a reviewer scanning the queue sorts by colour, not by number.
 */
export const SLA_WARNING_THRESHOLD = 75;
export const SLA_BREACH_THRESHOLD = 100;
