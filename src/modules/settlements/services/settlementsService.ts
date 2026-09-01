import { customFetch } from "@/utils/fetch";
import { SETTLEMENTS_PAGE_SIZE } from "../constants";
import {
  ALL_SETTLEMENTS,
  type ApiSettlementTicket,
  type SettlementActionResult,
  type SettlementsListResult,
  type SettlementsOverview,
  type SettlementsQueryParams,
  type SettlementTicket,
} from "../types";
import { mapApiSettlementTicket } from "../utils/settlementMapper";
import {
  MOCK_SETTLEMENT_TICKETS,
  mockSettlementsOverview,
} from "./settlementsMockData";

const SETTLEMENTS_ENDPOINT = "/api/v1/settlements/tickets/";

/**
 * The settlement endpoints are not deployed yet. Set this to `false` and delete
 * `settlementsMockData.ts` once they ship — the request code below is already
 * written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the settlement endpoints are deployed.
const USE_MOCK_SETTLEMENTS = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** Mirrors server-side filtering so the mock behaves like the real endpoint. */
function filterMockTickets(query: SettlementsQueryParams): SettlementTicket[] {
  const search = query.search.toLowerCase();

  return MOCK_SETTLEMENT_TICKETS.filter((ticket) => {
    if (query.status !== ALL_SETTLEMENTS && ticket.status !== query.status) {
      return false;
    }

    if (!search) return true;

    return (
      ticket.merchantName.toLowerCase().includes(search) ||
      ticket.merchantCode.toLowerCase().includes(search) ||
      ticket.ticketId.toLowerCase().includes(search)
    );
  });
}

/**
 * One page of settlement tickets.
 *
 * The status tab is a server-side filter, not a client-side slice: only the
 * selected tab's rows are ever transferred. Never throws — a failure comes back
 * as `error` so the table can render a banner in place of the rows.
 */
export async function fetchSettlements(
  query: SettlementsQueryParams,
): Promise<SettlementsListResult> {
  const pageSize = query.pageSize || SETTLEMENTS_PAGE_SIZE;

  if (USE_MOCK_SETTLEMENTS) {
    const filtered = filterMockTickets(query);
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
    PaginatedResponse<ApiSettlementTicket>
  >(SETTLEMENTS_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
      // The "All" tab deliberately sends no status at all.
      status: query.status === ALL_SETTLEMENTS ? undefined : query.status,
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
      error: error ?? "Failed to load settlement tickets.",
    };
  }

  return {
    data: data.results.map(mapApiSettlementTicket),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    error: null,
  };
}

/** The four KPI cards above the table. */
export async function fetchSettlementsOverview(): Promise<SettlementsOverview> {
  if (USE_MOCK_SETTLEMENTS) return mockSettlementsOverview();

  const { data } = await customFetch.get<SettlementsOverview>(
    `${SETTLEMENTS_ENDPOINT}overview/`,
    { cache: "no-store" },
  );

  return (
    data ?? {
      dueForPayment: 0,
      processing: 0,
      overdueTickets: 0,
      upcomingCount: 0,
      currency: "EGP",
    }
  );
}

/** Marks a due or overdue ticket as settled. */
export async function closeSettlementTicket(
  ticketId: string,
): Promise<SettlementActionResult> {
  if (USE_MOCK_SETTLEMENTS) {
    // Nothing is persisted yet — the rows are static mock data.
    return { success: true, error: null };
  }

  const { error } = await customFetch.post(
    `${SETTLEMENTS_ENDPOINT}${encodeURIComponent(ticketId)}/close/`,
  );

  if (error) return { success: false, error };

  return { success: true, error: null };
}

/**
 * Asks the backend to build the bank payment file for the current selection.
 * The response carries a URL rather than the bytes, so the file is fetched
 * straight from storage instead of being proxied through the app.
 */
export async function exportPaymentFile(
  query: SettlementsQueryParams,
): Promise<SettlementActionResult> {
  if (USE_MOCK_SETTLEMENTS) {
    return {
      success: false,
      error: "Payment file export is not available until settlements go live.",
    };
  }

  const { data, error } = await customFetch.post<{ file_url?: string }>(
    `${SETTLEMENTS_ENDPOINT}export/`,
    {
      search: query.search || undefined,
      status: query.status === ALL_SETTLEMENTS ? undefined : query.status,
    },
  );

  if (error) return { success: false, error };

  return { success: true, error: null, fileUrl: data?.file_url ?? null };
}
