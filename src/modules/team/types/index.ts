// ─── API shapes ──────────────────────────────────────────────────────────────

export type ApiTeamMember = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  role?: string | null;
  department?: string | null;
  /** `null` for an invitee — nothing is assigned until they accept. */
  merchant_count?: number | null;
  status: string;
  joined_at?: string | null;
  last_active_at?: string | null;
};

// ─── View model ──────────────────────────────────────────────────────────────

export const TEAM_DEPARTMENTS = [
  "acquisition",
  "compliance",
  "risk",
  "finance",
] as const;

export type TeamDepartment = (typeof TEAM_DEPARTMENTS)[number];

export function isTeamDepartment(value: string): value is TeamDepartment {
  return (TEAM_DEPARTMENTS as readonly string[]).includes(value);
}

export const TEAM_ROLES = [
  "acquisition_officer",
  "compliance_officer",
  "risk_officer",
  "finance_officer",
  "team_lead",
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export function isTeamRole(value: string): value is TeamRole {
  return (TEAM_ROLES as readonly string[]).includes(value);
}

/**
 * `invite_pending` is a member who has been invited but has not set a password
 * yet. They occupy a seat and appear in the list, but hold no assignments.
 */
export const TEAM_MEMBER_STATUSES = [
  "active",
  "suspended",
  "invite_pending",
] as const;

export type TeamMemberStatus = (typeof TEAM_MEMBER_STATUSES)[number];

export function isTeamMemberStatus(value: string): value is TeamMemberStatus {
  return (TEAM_MEMBER_STATUSES as readonly string[]).includes(value);
}

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  /** Two-letter monogram for the avatar. */
  initials: string;
  /** Deterministic avatar colour, derived from the name so it never shifts. */
  avatarTone: string;
  role: TeamRole;
  department: TeamDepartment;
  /** `null` for a pending invite — renders as a dash, not zero. */
  merchantCount: number | null;
  status: TeamMemberStatus;
  joinedAt: string;
  lastActiveAt: string;
};

// ─── Query params and results ────────────────────────────────────────────────

export type TeamQueryParams = {
  page: number;
  pageSize: number;
  search: string;
};

export type TeamListResult = {
  data: TeamMember[];
  /** Members matching the search — drives pagination, not the KPI cards. */
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  error: string | null;
};

export type TeamOverview = {
  totalMembers: number;
  active: number;
  pendingInvites: number;
  /** Sum of every member's assignments — one merchant can be covered twice. */
  merchantsCovered: number;
};

/** Active headcount per department, for the second KPI row. */
export type DepartmentSummary = {
  department: TeamDepartment;
  activeMembers: number;
};

/** Outcome of inviting, suspending, reactivating or resending. */
export type TeamActionResult = {
  success: boolean;
  error: string | null;
};
