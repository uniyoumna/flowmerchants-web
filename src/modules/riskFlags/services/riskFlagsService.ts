import { customFetch } from "@/utils/fetch";
import { RISK_FLAGS_PAGE_SIZE } from "../constants";
import {
  ALL_RISK_FLAGS,
  type ApiRiskFlagCase,
  type RiskFlagActionResult,
  type RiskFlagCase,
  type RiskFlagsListResult,
  type RiskFlagsOverview,
  type RiskFlagsQueryParams,
} from "../types";
import { mapApiRiskFlagCase } from "../utils/riskFlagMapper";
import { MOCK_RISK_FLAG_CASES } from "./riskFlagsMockData";

const RISK_FLAGS_ENDPOINT = "/api/v1/risk/flags/";

/**
 * The risk flag endpoints are not deployed yet. Set this to `false` and delete
 * `riskFlagsMockData.ts` once they ship — the request code below is already
 * written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the risk flag endpoints are deployed.
const USE_MOCK_RISK_FLAGS = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** Mirrors server-side filtering so the mock behaves like the real endpoint. */
function filterMockCases(query: RiskFlagsQueryParams): RiskFlagCase[] {
  const search = query.search.toLowerCase();

  return MOCK_RISK_FLAG_CASES.filter((riskCase) => {
    if (query.status !== ALL_RISK_FLAGS && riskCase.status !== query.status) {
      return false;
    }

    if (!search) return true;

    return (
      riskCase.merchantName.toLowerCase().includes(search) ||
      riskCase.merchantCode.toLowerCase().includes(search) ||
      riskCase.caseId.toLowerCase().includes(search)
    );
  });
}

/**
 * One page of risk flag cases.
 *
 * The status tab is a server-side filter, so only the selected tab's rows are
 * transferred. Never throws — a failure comes back as `error` so the table can
 * render a banner in place of the rows.
 */
export async function fetchRiskFlags(
  query: RiskFlagsQueryParams,
): Promise<RiskFlagsListResult> {
  const pageSize = query.pageSize || RISK_FLAGS_PAGE_SIZE;

  if (USE_MOCK_RISK_FLAGS) {
    const filtered = filterMockCases(query);
    const start = (query.page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      page: query.page,
      pageSize,
      error: null,
    };
  }

  const { data, error } = await customFetch.get<
    PaginatedResponse<ApiRiskFlagCase>
  >(RISK_FLAGS_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
      status: query.status === ALL_RISK_FLAGS ? undefined : query.status,
      ordering: query.ordering || undefined,
    },
    cache: "no-store",
  });

  if (error || !data) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      page: query.page,
      pageSize,
      error: error ?? "Failed to load risk flag cases.",
    };
  }

  return {
    data: data.results.map(mapApiRiskFlagCase),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    error: null,
  };
}

/**
 * The four KPI cards, counted from the cases themselves so they cannot
 * contradict the table. High severity spans every status — a resolved
 * high-severity case still happened.
 */
export async function fetchRiskFlagsOverview(): Promise<RiskFlagsOverview> {
  if (USE_MOCK_RISK_FLAGS) {
    const blocked = new Set(
      MOCK_RISK_FLAG_CASES.filter((c) => c.entityBlocked).map(
        (c) => c.merchantId,
      ),
    );

    return {
      openFlags: MOCK_RISK_FLAG_CASES.filter((c) => c.status === "open").length,
      underReview: MOCK_RISK_FLAG_CASES.filter(
        (c) => c.status === "under_review",
      ).length,
      highSeverity: MOCK_RISK_FLAG_CASES.filter((c) => c.severity === "high")
        .length,
      // One merchant can raise several cases; the card counts merchants.
      blockedMerchants: blocked.size,
    };
  }

  const { data } = await customFetch.get<RiskFlagsOverview>(
    `${RISK_FLAGS_ENDPOINT}overview/`,
    { cache: "no-store" },
  );

  return (
    data ?? {
      openFlags: 0,
      underReview: 0,
      highSeverity: 0,
      blockedMerchants: 0,
    }
  );
}

/**
 * Suspends the merchant behind a case and resolving a case share one shape of
 * endpoint, so they share an implementation — the caller picks the verb.
 */
async function actOnRiskFlag(
  caseId: string,
  action: "block" | "resolve",
): Promise<RiskFlagActionResult> {
  if (USE_MOCK_RISK_FLAGS) {
    // Nothing is persisted yet — the cases are static mock data.
    return { success: true, error: null };
  }

  const { error } = await customFetch.post(
    `${RISK_FLAGS_ENDPOINT}${encodeURIComponent(caseId)}/${action}/`,
  );

  if (error) return { success: false, error };

  return { success: true, error: null };
}

export function blockRiskFlagMerchant(
  caseId: string,
): Promise<RiskFlagActionResult> {
  return actOnRiskFlag(caseId, "block");
}

export function resolveRiskFlagCase(
  caseId: string,
): Promise<RiskFlagActionResult> {
  return actOnRiskFlag(caseId, "resolve");
}
