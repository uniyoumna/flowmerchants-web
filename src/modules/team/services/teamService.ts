import { customFetch } from "@/utils/fetch";
import { TEAM_PAGE_SIZE } from "../constants";
import type { InviteMemberValues } from "../schemas/inviteMemberSchema";
import {
  type ApiTeamMember,
  type DepartmentSummary,
  TEAM_DEPARTMENTS,
  type TeamActionResult,
  type TeamListResult,
  type TeamMember,
  type TeamOverview,
  type TeamQueryParams,
} from "../types";
import { mapApiTeamMember } from "../utils/teamMapper";
import { MOCK_TEAM_MEMBERS } from "./teamMockData";

const TEAM_ENDPOINT = "/api/v1/team/members/";

/**
 * The team endpoints are not deployed yet. Set this to `false` and delete
 * `teamMockData.ts` once they ship — the request code below is already written,
 * and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the team endpoints are deployed.
const USE_MOCK_TEAM = true;

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

/** Mirrors server-side filtering so the mock behaves like the real endpoint. */
function filterMockMembers(query: TeamQueryParams): TeamMember[] {
  const search = query.search.toLowerCase();
  if (!search) return MOCK_TEAM_MEMBERS;

  return MOCK_TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search) ||
      member.role.toLowerCase().includes(search),
  );
}

/**
 * Every team member. Never throws — a failure comes back as `error` so the
 * table can render a banner in place of the rows.
 */
export async function fetchTeamMembers(
  query: TeamQueryParams,
): Promise<TeamListResult> {
  const pageSize = query.pageSize || TEAM_PAGE_SIZE;

  if (USE_MOCK_TEAM) {
    const filtered = filterMockMembers(query);
    const start = (query.page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      totalItems: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      page: query.page,
      pageSize,
      error: null,
    };
  }

  const { data, error } = await customFetch.get<
    PaginatedResponse<ApiTeamMember>
  >(TEAM_ENDPOINT, {
    params: {
      page: query.page,
      page_size: pageSize,
      search: query.search || undefined,
    },
    cache: "no-store",
  });

  if (error || !data) {
    return {
      data: [],
      totalItems: 0,
      totalPages: 1,
      page: query.page,
      pageSize,
      error: error ?? "Failed to load team members.",
    };
  }

  return {
    data: data.results.map(mapApiTeamMember),
    totalItems: data.count,
    totalPages: Math.max(1, Math.ceil(data.count / pageSize)),
    page: query.page,
    pageSize,
    error: null,
  };
}

/**
 * Every member, ignoring the page on screen.
 *
 * The KPI cards describe the whole team, so they must not be computed from a
 * paginated slice — page 2 would otherwise report a different headcount.
 */
// TODO: replace with a dedicated counts endpoint so this stops over-fetching.
async function fetchAllMembers(): Promise<TeamMember[]> {
  if (USE_MOCK_TEAM) return MOCK_TEAM_MEMBERS;

  const { data } = await fetchTeamMembers({
    page: 1,
    pageSize: 500,
    search: "",
  });

  return data;
}

/**
 * The headline KPI row, counted from the members themselves so the cards cannot
 * contradict the table. Counts the whole team, never the filtered view — a
 * search should not appear to change how many people work here.
 */
export async function fetchTeamOverview(): Promise<TeamOverview> {
  const members = await fetchAllMembers();

  return {
    totalMembers: members.length,
    active: members.filter((member) => member.status === "active").length,
    pendingInvites: members.filter(
      (member) => member.status === "invite_pending",
    ).length,
    // One merchant can be covered by several people, so this is assignments,
    // not distinct merchants.
    merchantsCovered: members.reduce(
      (total, member) => total + (member.merchantCount ?? 0),
      0,
    ),
  };
}

/**
 * Active headcount per department.
 *
 * Counts active members only: a suspended or not-yet-accepted member holds a
 * seat but cannot do the work, so counting them would overstate capacity.
 */
export async function fetchDepartmentSummaries(): Promise<DepartmentSummary[]> {
  const members = await fetchAllMembers();

  return TEAM_DEPARTMENTS.map((department) => ({
    department,
    activeMembers: members.filter(
      (member) =>
        member.department === department && member.status === "active",
    ).length,
  }));
}

/** Sends the invitation email and creates the pending seat. */
export async function inviteTeamMember(
  values: InviteMemberValues,
): Promise<TeamActionResult> {
  if (USE_MOCK_TEAM) {
    // Nothing is persisted yet — the members are static mock data.
    return { success: true, error: null };
  }

  const { error } = await customFetch.post(`${TEAM_ENDPOINT}invite/`, values);

  if (error) return { success: false, error };

  return { success: true, error: null };
}

/**
 * Suspending, reactivating and resending share one shape of endpoint, so they
 * share an implementation — the caller picks the verb.
 */
async function actOnMember(
  memberId: string,
  action: "suspend" | "reactivate" | "resend",
): Promise<TeamActionResult> {
  if (USE_MOCK_TEAM) return { success: true, error: null };

  const { error } = await customFetch.post(
    `${TEAM_ENDPOINT}${encodeURIComponent(memberId)}/${action}/`,
  );

  if (error) return { success: false, error };

  return { success: true, error: null };
}

export function suspendTeamMember(id: string): Promise<TeamActionResult> {
  return actOnMember(id, "suspend");
}

export function reactivateTeamMember(id: string): Promise<TeamActionResult> {
  return actOnMember(id, "reactivate");
}

export function resendTeamInvite(id: string): Promise<TeamActionResult> {
  return actOnMember(id, "resend");
}
