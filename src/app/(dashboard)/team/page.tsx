import type { Metadata } from "next";
import { TeamMembersPage } from "@/modules/team/components/list/TeamMembersPage";

export const metadata: Metadata = {
  title: "Team Members",
  description: "Manage internal users, roles and permissions.",
};

type TeamPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const resolvedSearchParams = await searchParams;

  return <TeamMembersPage searchParams={resolvedSearchParams} />;
}
