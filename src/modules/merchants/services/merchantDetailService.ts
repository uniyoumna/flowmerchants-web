import { customFetch } from "@/utils/fetch";
import type {
  ApiMerchantDetail,
  MerchantBranchSummary,
  MerchantDetail,
  MerchantDetailCounts,
  MerchantFinancials,
  MerchantRiskSummary,
  MerchantTransaction,
} from "../types";
import { mapApiMerchantDetail } from "../utils/merchantDetailMapper";
import {
  mockBranches,
  mockFinancials,
  mockMerchantMetrics,
  mockRecentTransactions,
  mockRiskSummary,
} from "./merchantDetailMockData";

const MERCHANTS_ENDPOINT = "/api/v1/merchants/merchants/";

/**
 * The merchant record is real; its wallet, transaction, settlement, risk and
 * branch panels are not exposed yet. Set this to `false` and delete
 * `merchantDetailMockData.ts` once those endpoints ship — the call sites and
 * the view models do not change.
 */
// TODO: flip to `false` when the detail sub-resource endpoints are deployed.
const USE_MOCK_DETAIL_SECTIONS = true;

/**
 * Loads one merchant. Returns `null` for a merchant that does not exist so the
 * route can render a 404 rather than an error banner.
 */
export async function fetchMerchantDetail(
  id: string,
): Promise<{ data: MerchantDetail | null; error: string | null }> {
  const { data, error, status } = await customFetch.get<ApiMerchantDetail>(
    `${MERCHANTS_ENDPOINT}${encodeURIComponent(id)}/`,
    { cache: "no-store" },
  );

  if (status === 404) {
    return { data: null, error: null };
  }

  if (error || !data) {
    return { data: null, error: error ?? "Failed to load this merchant." };
  }

  const detail = mapApiMerchantDetail(data);

  // The KPI strip has no endpoint yet; without this the header would show three
  // zeroes on every merchant.
  return {
    data: USE_MOCK_DETAIL_SECTIONS
      ? { ...detail, ...mockMerchantMetrics(detail) }
      : detail,
    error: null,
  };
}

/** FE-141 — the drill-down behind the Overview tab. */
export async function fetchMerchantTransactions(
  merchantId: string,
): Promise<MerchantTransaction[]> {
  if (USE_MOCK_DETAIL_SECTIONS) return mockRecentTransactions(merchantId);

  const { data } = await customFetch.get<MerchantTransaction[]>(
    `${MERCHANTS_ENDPOINT}${encodeURIComponent(merchantId)}/transactions/`,
    { params: { page_size: 6 }, cache: "no-store" },
  );

  return data ?? [];
}

/** FE-110, FE-222 — gross-to-net totals and settlement history. */
export async function fetchMerchantFinancials(
  merchantId: string,
): Promise<MerchantFinancials> {
  if (USE_MOCK_DETAIL_SECTIONS) return mockFinancials(merchantId);

  const { data } = await customFetch.get<MerchantFinancials>(
    `${MERCHANTS_ENDPOINT}${encodeURIComponent(merchantId)}/financials/`,
    { cache: "no-store" },
  );

  return data ?? { gross: 0, netDisbursed: 0, totalRefunds: 0, tickets: [] };
}

/** FE-243, FE-253 — red-flag cases raised against this merchant. */
export async function fetchMerchantRiskSummary(
  merchantId: string,
): Promise<MerchantRiskSummary> {
  if (USE_MOCK_DETAIL_SECTIONS) return mockRiskSummary(merchantId);

  const { data } = await customFetch.get<MerchantRiskSummary>(
    `${MERCHANTS_ENDPOINT}${encodeURIComponent(merchantId)}/risk-flags/`,
    { cache: "no-store" },
  );

  return data ?? { open: 0, highSeverity: 0, underReview: 0, flags: [] };
}

/** FE-158 — the merchant's branch network. */
export async function fetchMerchantBranches(
  merchant: MerchantDetail,
): Promise<MerchantBranchSummary[]> {
  if (USE_MOCK_DETAIL_SECTIONS) return mockBranches(merchant);

  const { data } = await customFetch.get<MerchantBranchSummary[]>(
    `${MERCHANTS_ENDPOINT}${encodeURIComponent(merchant.id)}/branches/`,
    { cache: "no-store" },
  );

  return data ?? [];
}

/**
 * Badge numbers for the tab bar.
 *
 * The branch count already rides along on the merchant record, so only the two
 * panels with their own endpoints are fetched, and they go out in parallel. The
 * tab bar is part of the page shell rather than a streamed panel, so resolving
 * these up front is what stops the badges flickering up from zero.
 */
export async function fetchMerchantDetailCounts(
  merchant: MerchantDetail,
): Promise<MerchantDetailCounts> {
  const [financials, risk] = await Promise.all([
    fetchMerchantFinancials(merchant.id),
    fetchMerchantRiskSummary(merchant.id),
  ]);

  return {
    financials: financials.tickets.length,
    risk: risk.open,
    branches: merchant.activeBranches,
  };
}
