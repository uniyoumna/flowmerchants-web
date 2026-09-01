import type { SettlementsOverview, SettlementTicket } from "../types";

/**
 * ⚠️ TEMPORARY — stand-in data for the settlements list.
 *
 * The settlement endpoints are not deployed yet, so these rows exist to let the
 * screen be built and reviewed. Delete this file and flip `USE_MOCK_SETTLEMENTS`
 * in `settlementsService.ts` when they land — the view models and every call
 * site stay exactly as they are.
 *
 * Figures are fixed rather than randomised so a ticket shows the same numbers
 * on every render; otherwise the server and the browser would disagree and
 * React would report a hydration mismatch.
 */
export const MOCK_SETTLEMENT_TICKETS: SettlementTicket[] = [
  {
    id: "SET-20250108-001",
    ticketId: "SET-20250108-001",
    merchantId: "MCH-10031",
    merchantName: "Orascom Retail & Trading",
    merchantCode: "MCH-10031",
    period: "01 Jan 2025 – 07 Jan 2025",
    gross: 612400,
    refunds: 28600,
    fees: 18730,
    net: 565070,
    dueDate: "2025-01-08",
    status: "due",
    bankAccount: "CIB — Cairo — EGP ****6548",
    currency: "EGP",
  },
  {
    id: "SET-20250108-002",
    ticketId: "SET-20250108-002",
    merchantId: "MCH-10042",
    merchantName: "Cairo Electronics Co.",
    merchantCode: "MCH-10042",
    period: "01 Jan 2025 – 07 Jan 2025",
    gross: 284500,
    refunds: 12100,
    fees: 8150,
    net: 264250,
    dueDate: "2025-01-08",
    status: "processing",
    bankAccount: "NBE — Giza — EGP ****2213",
    currency: "EGP",
  },
  {
    id: "SET-20250108-003",
    ticketId: "SET-20250108-003",
    merchantId: "MCH-10039",
    merchantName: "Nile Fashion Group",
    merchantCode: "MCH-10039",
    period: "01 Jan 2025 – 07 Jan 2025",
    gross: 128300,
    refunds: 9400,
    fees: 3560,
    net: 115340,
    dueDate: "2025-01-08",
    status: "overdue",
    bankAccount: "QNB — Nasr City — EGP ****7781",
    currency: "EGP",
  },
  {
    id: "SET-20241231-007",
    ticketId: "SET-20241231-007",
    merchantId: "MCH-10028",
    merchantName: "Al-Ahram Auto Trading",
    merchantCode: "MCH-10028",
    period: "24 Dec 2024 – 31 Dec 2024",
    gross: 67200,
    // A genuine zero — this merchant took no refunds that week.
    refunds: 0,
    fees: 1680,
    net: 65520,
    dueDate: "2025-01-03",
    status: "held",
    bankAccount: "Banque Misr — Heliopolis — EGP ****9034",
    currency: "EGP",
  },
  {
    id: "SET-20241231-004",
    ticketId: "SET-20241231-004",
    merchantId: "MCH-10042",
    merchantName: "Cairo Electronics Co.",
    merchantCode: "MCH-10042",
    period: "24 Dec 2024 – 31 Dec 2024",
    gross: 198400,
    refunds: 7200,
    fees: 5800,
    net: 185400,
    dueDate: "2024-12-31",
    status: "closed",
    bankAccount: "NBE — Giza — EGP ****2213",
    currency: "EGP",
  },
  {
    id: "SET-20250115-001",
    ticketId: "SET-20250115-001",
    merchantId: "MCH-10031",
    merchantName: "Orascom Retail & Trading",
    merchantCode: "MCH-10031",
    period: "08 Jan 2025 – 15 Jan 2025",
    // Not calculated yet — the window has not closed, so every total is unknown
    // rather than zero.
    gross: null,
    refunds: null,
    fees: null,
    net: null,
    dueDate: "2025-01-15",
    status: "upcoming",
    bankAccount: "CIB — Cairo — EGP ****6548",
    currency: "EGP",
  },
];

/** Derived from the rows above so the cards always agree with the table. */
export function mockSettlementsOverview(): SettlementsOverview {
  const sumNet = (statuses: string[]) =>
    MOCK_SETTLEMENT_TICKETS.filter((ticket) =>
      statuses.includes(ticket.status),
    ).reduce((total, ticket) => total + (ticket.net ?? 0), 0);

  return {
    dueForPayment: sumNet(["due", "overdue"]),
    processing: sumNet(["processing"]),
    overdueTickets: MOCK_SETTLEMENT_TICKETS.filter(
      (ticket) => ticket.status === "overdue",
    ).length,
    upcomingCount: MOCK_SETTLEMENT_TICKETS.filter(
      (ticket) => ticket.status === "upcoming",
    ).length,
    currency: "EGP",
  };
}
