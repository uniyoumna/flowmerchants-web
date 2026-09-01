import {
  COMPLIANCE_PAGE_SIZE,
  COMPLIANCE_QUERY_KEYS,
  COMPLIANCE_REVIEW_QUERY_KEYS,
  DEFAULT_ORDERING,
} from "../constants";
import {
  ALL_STATUSES,
  COMPLIANCE_REVIEW_SECTIONS,
  type ComplianceQueryParams,
  type ComplianceReviewSection,
  isComplianceReviewSection,
  isComplianceStatus,
} from "../types";
import type { RawSearchParams } from "./merchantsQuery";

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function toPositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Validates and defaults every queue filter that can arrive in the URL. */
export function parseComplianceSearchParams(
  searchParams: RawSearchParams = {},
): ComplianceQueryParams {
  const rawStatus = firstValue(searchParams[COMPLIANCE_QUERY_KEYS.status]);
  const rawOrdering = firstValue(searchParams[COMPLIANCE_QUERY_KEYS.ordering]);

  return {
    page: toPositiveInt(
      firstValue(searchParams[COMPLIANCE_QUERY_KEYS.page]),
      1,
    ),
    pageSize: toPositiveInt(
      firstValue(searchParams[COMPLIANCE_QUERY_KEYS.pageSize]),
      COMPLIANCE_PAGE_SIZE,
    ),
    search: firstValue(searchParams[COMPLIANCE_QUERY_KEYS.search]).trim(),
    status: isComplianceStatus(rawStatus) ? rawStatus : ALL_STATUSES,
    ordering:
      rawOrdering && rawOrdering !== DEFAULT_ORDERING ? rawOrdering : "",
  };
}

/**
 * Stable string identity for a queue query — used as the `<Suspense key>` so a
 * filter change re-triggers the skeleton instead of showing stale rows.
 */
export function serializeComplianceQuery(query: ComplianceQueryParams): string {
  return [
    query.page,
    query.pageSize,
    query.search,
    query.status,
    query.ordering,
  ].join("|");
}

/** Route of one submission's review screen. */
export function complianceReviewPath(caseId: string): string {
  return `/merchants/compliance/${encodeURIComponent(caseId)}`;
}

/** Reads the active review section out of the URL, defaulting to General. */
export function parseComplianceReviewSection(
  searchParams: RawSearchParams = {},
): ComplianceReviewSection {
  const raw = searchParams[COMPLIANCE_REVIEW_QUERY_KEYS.section];
  const value = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  return isComplianceReviewSection(value)
    ? value
    : COMPLIANCE_REVIEW_SECTIONS[0];
}

/** `/merchants/compliance/CMP-1?section=bank` — General stays on the bare path. */
export function buildComplianceReviewHref(
  caseId: string,
  section: ComplianceReviewSection,
): string {
  const path = complianceReviewPath(caseId);
  if (section === COMPLIANCE_REVIEW_SECTIONS[0]) return path;

  return `${path}?${COMPLIANCE_REVIEW_QUERY_KEYS.section}=${section}`;
}
