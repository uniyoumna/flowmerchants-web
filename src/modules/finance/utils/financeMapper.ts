import type {
  ApiConfigWorkflow,
  ConfigStatus,
  ConfigSubmissionType,
  ConfigWorkflow,
} from "../types";
import { isConfigStatus, isConfigSubmissionType } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/** `2026-08-31T09:49:49Z` → `2026-08-31 09:49`. */
export function toTimestamp(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart, timePart] = value.split("T");
  if (!datePart) return EMPTY;
  if (!timePart) return datePart;

  return `${datePart} ${timePart.slice(0, 5)}`;
}

/** `2026-07-20T00:00:00Z` → `7/20/2026`, matching the Due Date column. */
export function toShortDate(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart] = value.split("T");
  const [year, month, day] = (datePart ?? "").split("-");
  if (!year || !month || !day) return value;

  return `${Number(month)}/${Number(day)}/${year}`;
}

function toPercent(value: number | string | null | undefined): number {
  const parsed = typeof value === "string" ? Number.parseFloat(value) : value;
  if (typeof parsed !== "number" || !Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.round(parsed));
}

function toStatus(value: string): ConfigStatus {
  return isConfigStatus(value) ? value : "pending_review";
}

function toSubmissionType(
  value: string | null | undefined,
): ConfigSubmissionType {
  const raw = value?.trim() ?? "";
  return isConfigSubmissionType(raw) ? raw : "initial";
}

/** One queue row → the shape the table renders. */
export function mapApiConfigWorkflow(api: ApiConfigWorkflow): ConfigWorkflow {
  const assignedTo = api.assigned_to?.trim();

  return {
    id: api.id,
    merchantId: api.merchant_id?.trim() ?? "",
    merchantName: nonEmpty(api.merchant_name),
    merchantCode: nonEmpty(api.merchant_code),
    businessType: nonEmpty(api.business_type),
    submissionType: toSubmissionType(api.submission_type),
    slaPercent: toPercent(api.sla_percent),
    submittedBy: nonEmpty(api.submitted_by),
    submittedAt: toTimestamp(api.submitted_at),
    status: toStatus(api.status),
    // An empty string means nobody owns it yet, same as a missing field.
    assignedTo: assignedTo ? assignedTo : null,
    dueDate: toShortDate(api.due_date),
  };
}
