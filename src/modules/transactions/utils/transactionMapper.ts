import type {
  ApiTransaction,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../types";
import { isTransactionStatus, isTransactionType } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/**
 * `2025-01-08T09:12:44Z` → `2025-01-08 09:12`.
 *
 * Truncated by hand rather than through `Intl`: the string is rendered on the
 * server and hydrated in the browser, and the two must match byte for byte.
 */
export function toTimestamp(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart, timePart] = value.split("T");
  if (!datePart) return EMPTY;
  if (!timePart) return datePart;

  return `${datePart} ${timePart.slice(0, 5)}`;
}

/** Amounts may arrive as numbers or as DRF decimal strings. */
export function toAmount(value: number | string | null | undefined): number {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;

  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : 0;
}

function toStatus(value: string): TransactionStatus {
  return isTransactionStatus(value) ? value : "pending";
}

function toType(value: string): TransactionType {
  return isTransactionType(value) ? value : "purchase";
}

/** One API transaction → the shape the table renders. */
export function mapApiTransaction(api: ApiTransaction): Transaction {
  const reference = api.reference?.trim();
  const currency = api.currency?.trim();

  return {
    id: api.id,
    reference: reference || api.id,
    merchantId: api.merchant_id?.trim() ?? "",
    merchantName: nonEmpty(api.merchant_name),
    branchName: nonEmpty(api.branch_name),
    customerName: nonEmpty(api.customer_name),
    type: toType(api.type),
    product: nonEmpty(api.product),
    amount: toAmount(api.amount),
    currency: currency || "EGP",
    createdAt: toTimestamp(api.created_at),
    status: toStatus(api.status),
  };
}
