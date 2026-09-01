import { fetchTeamMembers } from "../../services/teamService";
import type { TeamQueryParams } from "../../types";
import { TeamTableCard } from "./TeamTableCard";

type TeamTableSectionProps = {
  query: TeamQueryParams;
  isInviteOpen: boolean;
};

const TeamTableSection = async ({
  query,
  isInviteOpen,
}: TeamTableSectionProps) => {
  const result = await fetchTeamMembers(query);

  return <TeamTableCard result={result} isInviteOpen={isInviteOpen} />;
};

export default TeamTableSection;
export { TeamTableSection };
