"use server";

import { revalidatePath } from "next/cache";
import type { InviteMemberValues } from "@/modules/team/schemas/inviteMemberSchema";
import {
  inviteTeamMember,
  reactivateTeamMember,
  resendTeamInvite,
  suspendTeamMember,
} from "@/modules/team/services/teamService";
import type { TeamActionResult } from "@/modules/team/types";

/**
 * Team mutations run as Server Actions rather than browser fetches: the access
 * token lives in an `httpOnly` cookie, so a request made from the client would
 * go out unauthenticated (see `headerBuilder.ts`).
 */
export async function inviteTeamMemberAction(
  values: InviteMemberValues,
): Promise<TeamActionResult> {
  const result = await inviteTeamMember(values);

  // A new invite adds a pending seat, which moves the KPI counts.
  if (result.success) revalidatePath("/team");

  return result;
}

export async function suspendTeamMemberAction(
  memberId: string,
): Promise<TeamActionResult> {
  const result = await suspendTeamMember(memberId);

  if (result.success) revalidatePath("/team");

  return result;
}

export async function reactivateTeamMemberAction(
  memberId: string,
): Promise<TeamActionResult> {
  const result = await reactivateTeamMember(memberId);

  if (result.success) revalidatePath("/team");

  return result;
}

export async function resendTeamInviteAction(
  memberId: string,
): Promise<TeamActionResult> {
  return resendTeamInvite(memberId);
}
