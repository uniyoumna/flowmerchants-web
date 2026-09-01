import type {
  ApiComplianceCase,
  ComplianceCase,
  ComplianceStatus,
  ComplianceSubmissionType,
  ReviewDocument,
} from "../types";
import { isComplianceStatus, isComplianceSubmissionType } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/** `2026-08-31T09:49:49Z` → `2026-08-31 09:49`; anything else passes through. */
export function toTimestamp(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart, timePart] = value.split("T");
  if (!datePart) return EMPTY;
  if (!timePart) return datePart;

  return `${datePart} ${timePart.slice(0, 5)}`;
}

/** `2026-07-20T00:00:00Z` → `7/20/2026`, matching the queue's Due Date column. */
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

function toStatus(value: string): ComplianceStatus {
  return isComplianceStatus(value) ? value : "pending_review";
}

function toSubmissionType(
  value: string | null | undefined,
): ComplianceSubmissionType {
  const raw = value?.trim() ?? "";
  return isComplianceSubmissionType(raw) ? raw : "initial";
}

/** One queue row → the shape the table renders. */
export function mapApiComplianceCase(api: ApiComplianceCase): ComplianceCase {
  const assignedTo = api.assigned_to?.trim();

  return {
    id: api.id,
    merchantId: api.merchant_id,
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

const DOCUMENT_KINDS: Record<string, ReviewDocument["kind"]> = {
  pdf: "pdf",
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
  doc: "doc",
  docx: "doc",
};

/** Bytes → `5.3 MB`. Sizes are display-only, so decimal units are fine. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** File metadata → the document card. Returns `null` when nothing was uploaded. */
export function toReviewDocument(
  name: string | null | undefined,
  bytes: number | null | undefined,
  url: string | null = null,
): ReviewDocument | null {
  const clean = name?.trim();
  if (!clean) return null;

  const extension = clean.split(".").pop()?.toLowerCase() ?? "";

  return {
    name: clean,
    sizeLabel: formatFileSize(bytes ?? 0),
    kind: DOCUMENT_KINDS[extension] ?? "doc",
    url,
  };
}

/**
 * Leaves the last four characters visible and masks the rest in groups of four.
 * Full settlement account numbers are never needed to review an application, so
 * they are masked here — on the server — rather than in the component.
 */
export function maskAccountId(value: string, prefixLength = 0): string {
  const clean = value.replace(/[\s-]/g, "").toUpperCase();
  if (clean.length <= 4) return clean;

  const prefix = clean.slice(0, prefixLength);
  const visible = clean.slice(-4);
  const hiddenLength = Math.max(0, clean.length - prefixLength - 4);

  // Group the masked part in fours the way a printed account number reads, then
  // append the visible digits as their own group so an odd length never splits
  // them across two groups.
  const hidden = `${prefix}${"*".repeat(hiddenLength)}`.replace(
    /(.{4})(?=.)/g,
    "$1 ",
  );

  return `${hidden} ${visible}`;
}
