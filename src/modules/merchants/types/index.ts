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
