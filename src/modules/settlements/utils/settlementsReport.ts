import { SETTLEMENT_REPORT_STATUS_ORDER } from "../constants";
import type {
  ApiSettlementsReport,
  MerchantNetSettlement,
  SettlementStatusSummary,
  SettlementsReport,
  SettlementTicket,
} from "../types";
import { isSettlementStatus, type SETTLEMENT_STATUSES } from "../types";
import { toAmount } from "./settlementMapper";

/** Missing money is absent, not zero, so it must not drag a total down. */
function add(total: number, value: number | null): number {
  return total + (value ?? 0);
}

/**
 * Rolls a page of tickets up into the report.
 *
 * Derived from the tickets themselves rather than fetched separately so the
 * report can never contradict the list it summarises. When the reporting
 * endpoint ships this becomes the fallback, not the source.
 */
export function buildSettlementsReport(
  tickets: SettlementTicket[],
  currency = "EGP",
): SettlementsReport {
  const totals = tickets.reduce(
    (acc, ticket) => ({
      gross: add(acc.gross, ticket.gross),
      netDisbursed: add(acc.netDisbursed, ticket.net),
      refunds: add(acc.refunds, ticket.refunds),
      fees: add(acc.fees, ticket.fees),
      currency,
    }),
    { gross: 0, netDisbursed: 0, refunds: 0, fees: 0, currency },
  );

  // ─── Per merchant ───
  const merchants = new Map<string, MerchantNetSettlement>();

  for (const ticket of tickets) {
    // A merchant may settle several periods; the report shows one row per
    // merchant, so tickets are keyed by merchant rather than by ticket.
    const key = ticket.merchantId || ticket.merchantCode;
    const existing = merchants.get(key);

    if (existing) {
      existing.gross = add(existing.gross, ticket.gross);
      existing.refunds = add(existing.refunds, ticket.refunds);
      existing.net = add(existing.net, ticket.net);
      existing.ticketCount += 1;
      continue;
    }

    merchants.set(key, {
      merchantId: key,
      merchantName: ticket.merchantName,
      merchantCode: ticket.merchantCode,
      gross: ticket.gross ?? 0,
      refunds: ticket.refunds ?? 0,
      net: ticket.net ?? 0,
      ticketCount: 1,
    });
  }

  // ─── Per status ───
  const byStatus: SettlementStatusSummary[] = [];

  for (const status of SETTLEMENT_REPORT_STATUS_ORDER) {
    const matching = tickets.filter((ticket) => ticket.status === status);
    if (matching.length === 0) continue;

    // A state where nothing has been calculated yet reports a count with no
    // money, rather than a misleading zero.
    const calculated = matching.filter((ticket) => ticket.net !== null);

    byStatus.push({
      status,
      count: matching.length,
      amount:
        calculated.length === 0
          ? null
          : calculated.reduce((total, ticket) => add(total, ticket.net), 0),
    });
  }

  return {
    totals,
    // Biggest payout first — that is the order a finance operator reads in.
    byMerchant: [...merchants.values()].sort((a, b) => b.net - a.net),
    byStatus,
    error: null,
  };
}

/** The API's own report shape → the view model, when the endpoint exists. */
export function mapApiSettlementsReport(
  api: ApiSettlementsReport,
  fallbackCurrency = "EGP",
): SettlementsReport {
  const currency = api.totals?.currency?.trim() || fallbackCurrency;

  const byStatus = (api.by_status ?? [])
    .filter((row) => isSettlementStatus(row.status))
    .map((row) => ({
      status: row.status as (typeof SETTLEMENT_STATUSES)[number],
      count: row.count ?? 0,
      amount: toAmount(row.amount),
    }))
    .sort(
      (a, b) =>
        SETTLEMENT_REPORT_STATUS_ORDER.indexOf(a.status) -
        SETTLEMENT_REPORT_STATUS_ORDER.indexOf(b.status),
    );

  return {
    totals: {
      gross: toAmount(api.totals?.gross) ?? 0,
      netDisbursed: toAmount(api.totals?.net_disbursed) ?? 0,
      refunds: toAmount(api.totals?.refunds) ?? 0,
      fees: toAmount(api.totals?.fees) ?? 0,
      currency,
    },
    byMerchant: (api.by_merchant ?? []).map((row) => ({
      merchantId: row.merchant_id?.trim() || row.merchant_code?.trim() || "",
      merchantName: row.merchant_name?.trim() || "—",
      merchantCode: row.merchant_code?.trim() || "—",
      gross: toAmount(row.gross) ?? 0,
      refunds: toAmount(row.refunds) ?? 0,
      net: toAmount(row.net) ?? 0,
      ticketCount: row.ticket_count ?? 0,
    })),
    byStatus,
    error: null,
  };
}
