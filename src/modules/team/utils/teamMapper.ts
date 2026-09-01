import { initialsOf } from "@/utils/formatters";
import { TEAM_AVATAR_TONES } from "../constants";
import type {
  ApiTeamMember,
  TeamDepartment,
  TeamMember,
  TeamMemberStatus,
  TeamRole,
} from "../types";
import { isTeamDepartment, isTeamMemberStatus, isTeamRole } from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY;
}

/** `2023-03-15T00:00:00Z` → `2023-03-15`. */
export function toDateOnly(value: string | null | undefined): string {
  if (!value) return EMPTY;

  const [datePart] = value.split("T");
  return datePart || EMPTY;
}

/**
 * Picks an avatar colour from the name.
 *
 * Hashed rather than random so a member keeps the same colour across renders —
 * a colour that changed on every load would read as a different person, and a
 * random pick would also break hydration.
 */
export function avatarToneFor(name: string): string {
  let hash = 0;
  for (let index = 0; index < name.length; index++) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }

  return TEAM_AVATAR_TONES[hash % TEAM_AVATAR_TONES.length];
}

function toDepartment(value: string | null | undefined): TeamDepartment {
  const raw = value?.trim() ?? "";
  return isTeamDepartment(raw) ? raw : "acquisition";
}

function toRole(value: string | null | undefined): TeamRole {
  const raw = value?.trim() ?? "";
  return isTeamRole(raw) ? raw : "acquisition_officer";
}

function toStatus(value: string): TeamMemberStatus {
  return isTeamMemberStatus(value) ? value : "invite_pending";
}

/** One API member → the shape the table renders. */
export function mapApiTeamMember(api: ApiTeamMember): TeamMember {
  const name = nonEmpty(api.full_name);

  return {
    id: api.id,
    name,
    email: nonEmpty(api.email),
    initials: initialsOf(name),
    avatarTone: avatarToneFor(name),
    role: toRole(api.role),
    department: toDepartment(api.department),
    // `null` and `0` differ: an invitee has no assignments yet, which is not
    // the same as an active member who happens to cover none.
    merchantCount:
      typeof api.merchant_count === "number" ? api.merchant_count : null,
    status: toStatus(api.status),
    joinedAt: toDateOnly(api.joined_at),
    lastActiveAt: toDateOnly(api.last_active_at),
  };
}
