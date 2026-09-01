import { initialsOf } from "@/utils/formatters";
import type { TeamMember } from "../types";
import { avatarToneFor } from "../utils/teamMapper";

/**
 * ⚠️ TEMPORARY — stand-in data for the team screens.
 *
 * The team endpoints are not deployed yet. Delete this file and flip
 * `USE_MOCK_TEAM` in `teamService.ts` when they land — the view models and
 * every call site stay exactly as they are.
 *
 * Twelve members: ten active and two invited but not yet accepted. Every KPI on
 * the screen is counted from this list rather than hardcoded, so the cards and
 * the table cannot disagree.
 */
function member(
  name: string,
  email: string,
  role: TeamMember["role"],
  department: TeamMember["department"],
  merchantCount: number | null,
  status: TeamMember["status"],
  joinedAt: string,
  lastActiveAt: string,
): TeamMember {
  return {
    id: email,
    name,
    email,
    initials: initialsOf(name),
    avatarTone: avatarToneFor(name),
    role,
    department,
    merchantCount,
    status,
    joinedAt,
    lastActiveAt,
  };
}

const EMPTY = "—";

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  member(
    "Sara Hassan",
    "sara.hassan@flow.eg",
    "acquisition_officer",
    "acquisition",
    3,
    "active",
    "2023-03-15",
    "2025-01-08",
  ),
  member(
    "Ahmed Karim",
    "ahmed.karim@flow.eg",
    "acquisition_officer",
    "acquisition",
    2,
    "active",
    "2023-05-01",
    "2025-01-08",
  ),
  member(
    "Rania Fathy",
    "rania.fathy@flow.eg",
    "acquisition_officer",
    "acquisition",
    2,
    "active",
    "2023-07-20",
    "2025-01-07",
  ),
  member(
    "Omar Farouk",
    "omar.farouk@flow.eg",
    "acquisition_officer",
    "acquisition",
    2,
    "active",
    "2022-11-10",
    "2025-01-06",
  ),
  member(
    "Laila Nasser",
    "laila.nasser@flow.eg",
    "acquisition_officer",
    "acquisition",
    2,
    "active",
    "2024-01-08",
    "2025-01-08",
  ),
  member(
    "Mostafa Ali",
    "mostafa.ali@flow.eg",
    "compliance_officer",
    "compliance",
    3,
    "active",
    "2022-08-01",
    "2025-01-08",
  ),
  member(
    "Hana Soliman",
    "hana.soliman@flow.eg",
    "compliance_officer",
    "compliance",
    3,
    "active",
    "2023-02-14",
    "2025-01-07",
  ),
  member(
    "Dina Mahmoud",
    "dina.mahmoud@flow.eg",
    "compliance_officer",
    "compliance",
    2,
    "active",
    "2023-09-05",
    "2025-01-05",
  ),
  member(
    "Fatma Youssef",
    "fatma.youssef@flow.eg",
    "risk_officer",
    "risk",
    1,
    "active",
    "2023-06-01",
    "2025-01-06",
  ),
  member(
    "Khalid Mansour",
    "khalid.mansour@flow.eg",
    "risk_officer",
    "risk",
    2,
    "active",
    "2022-12-20",
    "2025-01-07",
  ),
  // Invited, not yet accepted: no assignments and no activity to report.
  member(
    "Yara Selim",
    "yara.selim@flow.eg",
    "finance_officer",
    "finance",
    null,
    "invite_pending",
    EMPTY,
    EMPTY,
  ),
  member(
    "Nour El-Din",
    "nour.eldin@flow.eg",
    "team_lead",
    "acquisition",
    null,
    "invite_pending",
    EMPTY,
    EMPTY,
  ),
];
