import type { Metadata } from "next";
import { TeamMembersPage } from "@/modules/team/components/list/TeamMembersPage";

export const metadata: Metadata = {
  title: "Invite Team Member",
  description: "Invite a colleague to the platform.",
};

type InviteMemberPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The sidebar's Invite Member link. It renders the members list with the invite
 * dialog already open, so the invite is a real URL — shareable, refreshable,
 * and closed by the browser back button — rather than transient state.
 */
export default async function InviteMemberPage({
  searchParams,
}: InviteMemberPageProps) {
  const resolvedSearchParams = await searchParams;

  return <TeamMembersPage searchParams={resolvedSearchParams} isInviteOpen />;
}
