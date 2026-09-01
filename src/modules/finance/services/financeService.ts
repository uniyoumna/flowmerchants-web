import { customFetch } from "@/utils/fetch";
import { CONFIG_PAGE_SIZE } from "../constants";
import type { MerchantConfigValues } from "../schemas/merchantConfigSchema";
import {
  ALL_CONFIG_STATUSES,
  type ApiConfigWorkflow,
  type ConfigOverview,
  type ConfigQueryParams,
  type ConfigQueueResult,
  type ConfigSubmitResult,
  type ConfigWorkflow,
  type MerchantConfigDetail,
} from "../types";
import { mapApiConfigWorkflow } from "../utils/financeMapper";
import {
  MOCK_CONFIG_WORKFLOWS,
  mockConfigOverview,
  mockMerchantConfigDetail,
} from "./financeMockData";

const CONFIG_ENDPOINT = "/api/v1/finance/configurations/";

/**
 * The finance configuration endpoints are not deployed yet. Set this to `false`
 * and delete `financeMockData.ts` once they ship — the request code below is
 * already written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the finance configuration endpoints are deployed.
const USE_MOCK_FINANCE = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** Mirrors server-side filtering so the mock behaves like the real endpoint. */
function filterMockWorkflows(query: ConfigQueryParams): ConfigWorkflow[] {
  const search = query.search.toLowerCase();

  return MOCK_CONFIG_WORKFLOWS.filter((row) => {
    if (query.status !== ALL_CONFIG_STATUSES && row.status !== query.status) {
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
 * One page of the configuration queue. Never throws — a failure comes back as
 * `error` so the table can render a banner in place of the rows.
 */
export async function fetchConfigQueue(
  query: ConfigQueryParams,
): Promise<ConfigQueueResult> {
  const pageSize = query.pageSize || CONFIG_PAGE_SIZE;

  if (USE_MOCK_FINANCE) {
    const filtered = filterMockWorkflows(query);
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
    PaginatedResponse<ApiConfigWorkflow>
  >(CONFIG_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
      status: query.status === ALL_CONFIG_STATUSES ? undefined : query.status,
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
      error: error ?? "Failed to load the configuration queue.",
    };
  }

  return {
    data: data.results.map(mapApiConfigWorkflow),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    error: null,
  };
}

/** The four KPI cards above the queue. */
export async function fetchConfigOverview(): Promise<ConfigOverview> {
  if (USE_MOCK_FINANCE) return mockConfigOverview();

  const { data } = await customFetch.get<ConfigOverview>(
    `${CONFIG_ENDPOINT}overview/`,
    { cache: "no-store" },
  );

  return (
    data ?? { underReview: 0, slaOverdue: 0, pendingReview: 0, expiryRisk: 0 }
  );
}

/**
 * The configuration screen behind one queue row. Returns `null` for a workflow
 * that does not exist so the route can render a 404 rather than an error.
 */
export async function fetchMerchantConfig(
  workflowId: string,
): Promise<{ data: MerchantConfigDetail | null; error: string | null }> {
  if (USE_MOCK_FINANCE) {
    const workflow = MOCK_CONFIG_WORKFLOWS.find((row) => row.id === workflowId);
    if (!workflow) return { data: null, error: null };

    return { data: mockMerchantConfigDetail(workflow), error: null };
  }

  const { data, error, status } = await customFetch.get<MerchantConfigDetail>(
    `${CONFIG_ENDPOINT}${encodeURIComponent(workflowId)}/`,
    { cache: "no-store" },
  );

  if (status === 404) return { data: null, error: null };

  if (error || !data) {
    return {
      data: null,
      error: error ?? "Failed to load this merchant's configuration.",
    };
  }

  return { data, error: null };
}

/** Saves the merchant's financial parameters. */
export async function submitMerchantConfig(
  workflowId: string,
  values: MerchantConfigValues,
): Promise<ConfigSubmitResult> {
  if (USE_MOCK_FINANCE) {
    // Nothing is persisted yet — the workflows are static mock data.
    return { success: true, error: null };
  }

  const { error } = await customFetch.post(
    `${CONFIG_ENDPOINT}${encodeURIComponent(workflowId)}/submit/`,
    values,
  );

  if (error) return { success: false, error };

  return { success: true, error: null };
}
