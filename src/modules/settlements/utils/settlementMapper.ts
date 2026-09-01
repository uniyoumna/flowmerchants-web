import type {
  ApiSettlementTicket,
  SettlementStatus,
  SettlementTicket,
} from "../types";
import { isSettlementStatus } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/**
 * `2025-01-07T00:00:00Z` → `07 Jan 2025`.
 *
 * Formatted by hand rather than through `Intl`: these strings are rendered on
 * the server and hydrated in the browser, and the two must match byte for byte.
 */
function toDayMonthYear(value: string | null | undefined): string | null {
  if (!value) return null;

  const [datePart] = value.split("T");
  const [year, month, day] = (datePart ?? "").split("-");
  const monthName = MONTHS[Number(month) - 1];
  if (!year || !monthName || !day) return null;

  return `${day.padStart(2, "0")} ${monthName} ${year}`;
}

/** `01 Jan 2025 – 07 Jan 2025`, or one end alone when the other is missing. */
export function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const from = toDayMonthYear(start);
  const to = toDayMonthYear(end);

  if (from && to) return `${from} – ${to}`;

  return from ?? to ?? EMPTY;
}

/** `2025-01-08T00:00:00Z` → `2025-01-08`. */
export function toDateOnly(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart] = value.split("T");
  return datePart || EMPTY;
}

/**
 * Amounts may arrive as numbers or as DRF decimal strings. Returns `null` — not
 * `0` — for a missing figure: an upcoming ticket has not been calculated yet,
 * and showing it as zero money would be a lie.
 */
export function toAmount(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;

  return Number.isFinite(parsed) ? parsed : null;
}

function toStatus(value: string): SettlementStatus {
  return isSettlementStatus(value) ? value : "upcoming";
}

/** One API ticket → the shape the table renders. */
export function mapApiSettlementTicket(
  api: ApiSettlementTicket,
): SettlementTicket {
  return {
    id: api.id,
    ticketId:
      nonEmpty(api.ticket_id) === EMPTY ? api.id : nonEmpty(api.ticket_id),
    merchantId: api.merchant_id?.trim() ?? "",
    merchantName: nonEmpty(api.merchant_name),
    merchantCode: nonEmpty(api.merchant_code),
    period: formatPeriod(api.period_start, api.period_end),
    gross: toAmount(api.gross),
    refunds: toAmount(api.refunds),
    fees: toAmount(api.fees),
    net: toAmount(api.net),
    dueDate: toDateOnly(api.due_date),
    status: toStatus(api.status),
    bankAccount: nonEmpty(api.bank_account),
    currency: nonEmpty(api.currency) === EMPTY ? "EGP" : nonEmpty(api.currency),
  };
}
