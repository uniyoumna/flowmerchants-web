import { customFetch } from "@/utils/fetch";
import { COMPLIANCE_PAGE_SIZE } from "../constants";
import {
  ALL_STATUSES,
  type ApiComplianceCase,
  type ComplianceCase,
  type ComplianceDecisionResult,
  type ComplianceOverview,
  type ComplianceQueryParams,
  type ComplianceQueueResult,
  type ComplianceReviewDetail,
} from "../types";
import { mapApiComplianceCase } from "../utils/complianceMapper";
import {
  MOCK_COMPLIANCE_QUEUE,
  mockComplianceOverview,
  mockComplianceReviewDetail,
} from "./complianceMockData";

const COMPLIANCE_ENDPOINT = "/api/v1/merchants/compliance-cases/";

/**
 * The compliance workflow has no endpoints yet. Set this to `false` and delete
 * `complianceMockData.ts` once they ship — the request code below is already
 * written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the compliance endpoints are deployed.
const USE_MOCK_COMPLIANCE = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** Applies the queue's search / status filters to the in-memory mock rows. */
function filterMockQueue(query: ComplianceQueryParams): ComplianceCase[] {
  const search = query.search.toLowerCase();

  return MOCK_COMPLIANCE_QUEUE.filter((row) => {
    if (query.status !== ALL_STATUSES && row.status !== query.status) {
      return false;
    }

    if (!search) return true;

    return (
      row.merchantName.toLowerCase().includes(search) ||
      row.merchantCode.toLowerCase().includes(search) ||
      row.businessType.toLowerCase().includes(search)
    );
  });
}

/**
 * One page of the compliance queue. Never throws — a failure comes back as
 * `error` so the table can render a banner in place of the rows.
 */
export async function fetchComplianceQueue(
  query: ComplianceQueryParams,
): Promise<ComplianceQueueResult> {
  const pageSize = query.pageSize || COMPLIANCE_PAGE_SIZE;

  if (USE_MOCK_COMPLIANCE) {
    const filtered = filterMockQueue(query);
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
    PaginatedResponse<ApiComplianceCase>
  >(COMPLIANCE_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
      status: query.status === ALL_STATUSES ? undefined : query.status,
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
      error: error ?? "Failed to load the compliance queue.",
    };
  }

  return {
    data: data.results.map(mapApiComplianceCase),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    error: null,
  };
}

/** The four KPI cards above the queue. */
export async function fetchComplianceOverview(): Promise<ComplianceOverview> {
  if (USE_MOCK_COMPLIANCE) return mockComplianceOverview();

  const { data } = await customFetch.get<ComplianceOverview>(
    `${COMPLIANCE_ENDPOINT}overview/`,
    { cache: "no-store" },
  );

  return (
    data ?? { underReview: 0, slaOverdue: 0, pendingReview: 0, expiryRisk: 0 }
  );
}

/**
 * The full application behind one queue row. Returns `null` for a case that
 * does not exist so the route can render a 404 rather than an error banner.
 */
export async function fetchComplianceCase(
  caseId: string,
): Promise<{ data: ComplianceReviewDetail | null; error: string | null }> {
  if (USE_MOCK_COMPLIANCE) {
    const queued = MOCK_COMPLIANCE_QUEUE.find((row) => row.id === caseId);
    if (!queued) return { data: null, error: null };

    return { data: mockComplianceReviewDetail(queued), error: null };
  }

  const { data, error, status } = await customFetch.get<ComplianceReviewDetail>(
    `${COMPLIANCE_ENDPOINT}${encodeURIComponent(caseId)}/`,
    { cache: "no-store" },
  );

  if (status === 404) return { data: null, error: null };

  if (error || !data) {
    return { data: null, error: error ?? "Failed to load this submission." };
  }

  return { data, error: null };
}

/**
 * Records the reviewer's decision.
 *
 * Approving and rejecting hit the same shape of endpoint, so they share one
 * implementation — the caller picks the verb. `reason` is sent only when the
 * reviewer supplied one; the backend requires it for a rejection.
 */
async function decideComplianceCase(
  caseId: string,
  decision: "approve" | "reject",
  reason?: string,
): Promise<ComplianceDecisionResult> {
  if (USE_MOCK_COMPLIANCE) {
    // Nothing is persisted yet — the queue rows are static mock data, so the
    // caller gets a success it can wire the toast and redirect against.
    return { success: true, error: null };
  }

  const { error } = await customFetch.post(
    `${COMPLIANCE_ENDPOINT}${encodeURIComponent(caseId)}/${decision}/`,
    reason ? { reason } : undefined,
  );

  if (error) return { success: false, error };

  return { success: true, error: null };
}

export function approveComplianceCase(
  caseId: string,
): Promise<ComplianceDecisionResult> {
  return decideComplianceCase(caseId, "approve");
}

export function rejectComplianceCase(
  caseId: string,
  reason?: string,
): Promise<ComplianceDecisionResult> {
  return decideComplianceCase(caseId, "reject", reason);
}
