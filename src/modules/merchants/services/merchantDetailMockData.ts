import type {
  MerchantBranchSummary,
  MerchantDetail,
  MerchantFinancials,
  MerchantRiskSummary,
  MerchantSettlementTicket,
  MerchantTransaction,
} from "../types";

/**
 * ⚠️ TEMPORARY — stand-in data for the merchant detail panels.
 *
 * The merchant record itself comes from the real API. Wallet metrics, recent
 * transactions, settlement history, risk flags and branches do not have
 * endpoints yet, so they are generated here to let the screen be built and
 * reviewed. Delete this file and flip `USE_MOCK_DETAIL_SECTIONS` in
 * `merchantDetailService.ts` when those endpoints land.
 *
 * Everything is derived from the merchant ID rather than randomised, so a
 * merchant shows the same figures on every render — otherwise the server and
 * the browser would disagree and React would report a hydration mismatch.
 */

/** Small deterministic hash — same ID always yields the same numbers. */
function seedOf(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic value in `[min, max]` for a given seed and salt. */
function pick(seed: number, salt: number, min: number, max: number): number {
  const mixed = (seed ^ (salt * 2654435761)) >>> 0;
  return min + (mixed % (max - min + 1));
}

const CITIES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Heliopolis",
  "Maadi",
  "Nasr City",
];

const CUSTOMERS = [
  "Ahmed Samir",
  "Hassan Ramzy",
  "Mona Adel",
  "Youssef Nabil",
  "Laila Farouk",
  "Omar Khaled",
];

/** Wallet KPIs and the assigned team the list endpoint does not expose. */
export function mockMerchantMetrics(
  detail: MerchantDetail,
): Pick<
  MerchantDetail,
  "walletBalance" | "pendingSettlement" | "totalPurchases"
> {
  const seed = seedOf(detail.id);

  return {
    walletBalance: pick(seed, 1, 40, 900) * 500,
    pendingSettlement: pick(seed, 2, 20, 300) * 500,
    totalPurchases: pick(seed, 3, 200, 4000),
  };
}

export function mockRecentTransactions(
  merchantId: string,
): MerchantTransaction[] {
  const seed = seedOf(merchantId);

  return Array.from({ length: 6 }, (_, index) => {
    const day = 8 - index;
    const isRefund = pick(seed, index + 40, 0, 9) > 7;

    return {
      id: `TXN-2501${String(day).padStart(2, "0")}-00${90 + index}`,
      branch: `${CITIES[pick(seed, index + 10, 0, CITIES.length - 1)]} Branch`,
      customer: CUSTOMERS[pick(seed, index + 20, 0, CUSTOMERS.length - 1)],
      type: isRefund ? "refund" : "purchase",
      amount: pick(seed, index + 30, 20, 480) * 100,
      date: `2025-01-${String(day).padStart(2, "0")} ${String(
        pick(seed, index + 50, 9, 18),
      ).padStart(2, "0")}:${String(pick(seed, index + 60, 10, 59))}`,
    };
  });
}

export function mockFinancials(merchantId: string): MerchantFinancials {
  const seed = seedOf(merchantId);

  const tickets: MerchantSettlementTicket[] = (
    [
      {
        id: "SET-20250108-002",
        period: "01 Jan 2025 – 07 Jan 2025",
        gross: pick(seed, 71, 200, 400) * 1000,
        refunds: pick(seed, 72, 8, 20) * 1000,
        fees: pick(seed, 73, 4, 12) * 1000,
        net: 0,
        dueDate: "2025-01-08",
        status: "processing",
      },
      {
        id: "SET-20241231-004",
        period: "24 Dec 2024 – 31 Dec 2024",
        gross: pick(seed, 74, 150, 320) * 1000,
        refunds: pick(seed, 75, 5, 15) * 1000,
        fees: pick(seed, 76, 3, 9) * 1000,
        net: 0,
        dueDate: "2024-12-31",
        status: "closed",
      },
    ] satisfies MerchantSettlementTicket[]
  ).map((ticket) => ({
    ...ticket,
    net: ticket.gross - ticket.refunds - ticket.fees,
  }));

  const gross = tickets.reduce((sum, ticket) => sum + ticket.gross, 0);
  const totalRefunds = tickets.reduce((sum, ticket) => sum + ticket.refunds, 0);
  const fees = tickets.reduce((sum, ticket) => sum + ticket.fees, 0);

  return {
    gross,
    totalRefunds,
    netDisbursed: gross - totalRefunds - fees,
    tickets,
  };
}

/** No open flags is the healthy default the empty state is designed for. */
export function mockRiskSummary(merchantId: string): MerchantRiskSummary {
  void merchantId;

  return { open: 0, highSeverity: 0, underReview: 0, flags: [] };
}

export function mockBranches(detail: MerchantDetail): MerchantBranchSummary[] {
  const seed = seedOf(detail.id);
  const count = Math.max(detail.activeBranches, 0);

  return Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(3, "0");

    return {
      id: `BR-${detail.code}-${number}`,
      name: `${detail.name} — Branch ${index + 1}`,
      code: `BR-${detail.code}-${number}`,
      city: CITIES[pick(seed, index + 80, 0, CITIES.length - 1)],
      transactions: pick(seed, index + 90, 60, 200),
      isActive: true,
    };
  });
}
