import { TEAM_PAGE_SIZE, TEAM_QUERY_KEYS } from "../constants";
import type { TeamQueryParams } from "../types";

/** The shape Next.js hands a page via its `searchParams` prop. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function toPositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Validates and defaults every filter that can arrive in the URL. */
export function parseTeamSearchParams(
  searchParams: RawSearchParams = {},
): TeamQueryParams {
  return {
    page: toPositiveInt(firstValue(searchParams[TEAM_QUERY_KEYS.page]), 1),
    pageSize: toPositiveInt(
      firstValue(searchParams[TEAM_QUERY_KEYS.pageSize]),
      TEAM_PAGE_SIZE,
    ),
    search: firstValue(searchParams[TEAM_QUERY_KEYS.search]).trim(),
  };
}

/**
 * Stable string identity for a query — used as the `<Suspense key>` so a search
 * or page change re-triggers the skeleton instead of showing stale rows.
 */
export function serializeTeamQuery(query: TeamQueryParams): string {
  return [query.page, query.pageSize, query.search].join("|");
}
