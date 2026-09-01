import { z } from "zod";
import { TEAM_DEPARTMENTS, TEAM_ROLES } from "../types";

/**
 * Invite a team member.
 *
 * Department and role are validated against the same tuples the selects are
 * built from, so a hand-crafted request cannot create a seat with a role that
 * does not exist.
 */
const inviteMemberSchema = z.object({
  fullName: z.string().trim().min(3, "Enter the full name"),
  email: z.email("Enter a valid email address"),
  department: z.enum(TEAM_DEPARTMENTS),
  role: z.enum(TEAM_ROLES),
});

type InviteMemberValues = z.input<typeof inviteMemberSchema>;

/** Blank invite — the dialog opens on the most common pairing. */
const INVITE_MEMBER_DEFAULTS: InviteMemberValues = {
  fullName: "",
  email: "",
  department: "acquisition",
  role: "acquisition_officer",
};

export { INVITE_MEMBER_DEFAULTS, inviteMemberSchema };
export type { InviteMemberValues };
