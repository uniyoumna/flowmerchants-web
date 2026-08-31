import type { FetchRequestOptions } from "@/utils/fetch";
import { customFetch } from "@/utils/fetch";
import { AT_RISK_STATUSES, PENDING_STATUSES } from "../constants";
import type {
  ApiMerchant,
  MerchantsListResult,
  MerchantsOverview,
  MerchantsQueryParams,
  PaginatedResponse,
} from "../types";
import { mapApiMerchant, toStatusParam } from "../utils/merchantMapper";

const MERCHANTS_ENDPOINT = "/api/v1/merchants/merchants/";
const ACQUISITION_OVERVIEW_ENDPOINT =
  "/api/v1/merchants/oversight/acquisition/";

export async function fetchMerchants(
  query: MerchantsQueryParams,
  options: FetchRequestOptions = {},
): Promise<MerchantsListResult> {
  const { data, error } = await customFetch.get<PaginatedResponse<ApiMerchant>>(
    MERCHANTS_ENDPOINT,
    {
      params: {
        page: query.page,
        page_size: query.pageSize,
        search: query.search,
        status: toStatusParam(query.status),
        ordering: query.ordering,
      },
      cache: "no-store",
      ...options,
    },
  );

  if (error || !data) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      page: query.page,
      pageSize: query.pageSize,
      error: error ?? "Failed to load merchants.",
    };
  }

  const totalItems = data.count ?? 0;

  return {
    data: (data.results ?? []).map(mapApiMerchant),
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / query.pageSize)),
    page: query.page,
    pageSize: query.pageSize,
    error: null,
  };
}

/**
 * FE-208, FE-209 — merchant counts by onboarding status for the KPI cards.
 * The payload is untyped in the schema, so counts are read defensively and the
 * cards fall back to zeroes rather than breaking the page.
 */
export async function fetchMerchantsOverview(): Promise<MerchantsOverview> {
  const { data } = await customFetch.get<Record<string, unknown>>(
    ACQUISITION_OVERVIEW_ENDPOINT,
    { cache: "no-store" },
  );

  const empty: MerchantsOverview = {
    total: 0,
    active: 0,
    pending: 0,
    atRisk: 0,
  };

  if (!data || typeof data !== "object") return empty;

  // Counts may sit at the root or under a `by_status` / `counts` bucket.
  const buckets = [
    data,
    data.by_status as Record<string, unknown> | undefined,
    data.counts as Record<string, unknown> | undefined,
    data.status_counts as Record<string, unknown> | undefined,
  ].filter((bucket): bucket is Record<string, unknown> =>
    Boolean(bucket && typeof bucket === "object"),
  );

  const countOf = (key: string): number => {
    for (const bucket of buckets) {
      const value = bucket[key];
      if (typeof value === "number") return value;
    }
    return 0;
  };

  const sumOf = (keys: string[]): number =>
    keys.reduce((sum, key) => sum + countOf(key), 0);

  const total =
    countOf("total") || countOf("count") || countOf("total_merchants");

  return {
    total,
    active: countOf("active"),
    pending: sumOf(PENDING_STATUSES),
    atRisk: sumOf(AT_RISK_STATUSES),
  };
}
