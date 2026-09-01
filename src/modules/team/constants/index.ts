/** Constants for the team module. */
import type { TeamDepartment, TeamMemberStatus, TeamRole } from "../types";

export const TEAM_DEPARTMENT_LABELS: Record<TeamDepartment, string> = {
  acquisition: "Acquisition",
  compliance: "Compliance",
  risk: "Risk",
  finance: "Finance",
};

export const TEAM_DEPARTMENT_STYLES: Record<TeamDepartment, string> = {
  acquisition: "bg-purple-100 text-[#7C3AED]",
  compliance: "bg-indigo-100 text-indigo-700",
  risk: "bg-rose-100 text-rose-600",
  finance: "bg-emerald-100 text-emerald-700",
};

/** Accent for the per-department KPI cards. */
export const TEAM_DEPARTMENT_ACCENTS: Record<TeamDepartment, string> = {
  acquisition: "text-[#7C3AED]",
  compliance: "text-indigo-600",
  risk: "text-rose-600",
  finance: "text-emerald-600",
};

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  acquisition_officer: "Acquisition Officer",
  compliance_officer: "Compliance Officer",
  risk_officer: "Risk Officer",
  finance_officer: "Finance Officer",
  team_lead: "Team Lead",
};

export const TEAM_STATUS_LABELS: Record<TeamMemberStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  invite_pending: "Invite Pending",
};

/** `surface` tints the pill; `dot` colours the status light inside it. */
export const TEAM_STATUS_STYLES: Record<
  TeamMemberStatus,
  { surface: string; dot: string }
> = {
  active: { surface: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  suspended: { surface: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
  invite_pending: {
    surface: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
};

/** Avatar palette. Picked by a hash of the name, so a member keeps its colour. */
export const TEAM_AVATAR_TONES = [
  "bg-slate-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-600",
  "bg-pink-500",
  "bg-[#7C3AED]",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-orange-500",
];

/** Options for the invite dialog, derived from the label maps. */
export const TEAM_DEPARTMENT_OPTIONS = (
  Object.keys(TEAM_DEPARTMENT_LABELS) as TeamDepartment[]
).map((department) => ({
  label: TEAM_DEPARTMENT_LABELS[department],
  value: department,
}));

export const TEAM_ROLE_OPTIONS = (
  Object.keys(TEAM_ROLE_LABELS) as TeamRole[]
).map((role) => ({ label: TEAM_ROLE_LABELS[role], value: role }));

/* ─── Team members screen ─── */

export const TEAM_PAGE_SIZE = 10;
export const TEAM_SEARCH_DEBOUNCE_MS = 350;

export const TEAM_QUERY_KEYS = {
  search: "search",
  page: "page",
  pageSize: "page_size",
} as const;

/** How long an invitation link stays valid, shown in the dialog. */
export const INVITE_EXPIRY_HOURS = 72;
