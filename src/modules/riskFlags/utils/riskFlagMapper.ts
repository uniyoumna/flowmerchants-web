import { formatAmount } from "@/utils/formatters";
import type {
  ApiRiskFlagCase,
  RiskFlagCase,
  RiskFlagSeverity,
  RiskFlagStatus,
  RiskFlagType,
} from "../types";
import { isRiskFlagSeverity, isRiskFlagStatus, isRiskFlagType } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/**
 * `2025-01-05T14:32:10Z` → `2025-01-05 14:32`.
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

/**
 * `148200` + `EGP` → `EGP 148,200`; `84` + `refunds` → `84 refunds`.
 *
 * A currency reads before the number and a plain unit reads after it, so the
 * unit's position is decided here rather than in the table cell.
 */
export function formatObserved(
  value: number | string | null | undefined,
  unit: string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return EMPTY;

  const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
  const cleanUnit = unit?.trim() ?? "";

  if (!Number.isFinite(numeric))
    return `${value}${cleanUnit ? ` ${cleanUnit}` : ""}`;

  const amount = formatAmount(numeric as number);
  if (!cleanUnit) return amount;

  // A currency code is upper case; anything else is a plain noun like "refunds".
  const isCurrency =
    cleanUnit === cleanUnit.toUpperCase() && cleanUnit.length <= 3;

  return isCurrency ? `${cleanUnit} ${amount}` : `${amount} ${cleanUnit}`;
}

function toStatus(value: string): RiskFlagStatus {
  return isRiskFlagStatus(value) ? value : "open";
}

function toSeverity(value: string): RiskFlagSeverity {
  return isRiskFlagSeverity(value) ? value : "low";
}

function toType(value: string): RiskFlagType {
  return isRiskFlagType(value) ? value : "purchase_spike";
}

/** One API case → the shape the table renders. */
export function mapApiRiskFlagCase(api: ApiRiskFlagCase): RiskFlagCase {
  const caseId = api.case_id?.trim();
  const assignedTo = api.assigned_to?.trim();

  return {
    id: api.id,
    caseId: caseId || api.id,
    merchantId: api.merchant_id?.trim() ?? "",
    merchantName: nonEmpty(api.merchant_name),
    merchantCode: nonEmpty(api.merchant_code),
    // A blank branch means the rule tripped across the whole merchant.
    branchName: api.branch_name?.trim() ?? "",
    type: toType(api.type),
    metric: nonEmpty(api.metric),
    observed: formatObserved(api.observed_value, api.observed_unit),
    threshold: nonEmpty(api.threshold),
    severity: toSeverity(api.severity),
    status: toStatus(api.status),
    detectedAt: toTimestamp(api.detected_at),
    assignedTo: assignedTo ? assignedTo : null,
    entityBlocked: api.entity_blocked === true,
  };
}
