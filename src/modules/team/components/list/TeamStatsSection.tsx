import {
  fetchDepartmentSummaries,
  fetchTeamOverview,
} from "../../services/teamService";
import { TeamDepartmentGrid } from "./TeamDepartmentGrid";
import { TeamStatsGrid } from "./TeamStatsGrid";

const TeamStatsSection = async () => {
  // Both rows come from the same member list, so they are fetched together.
  const [overview, departments] = await Promise.all([
    fetchTeamOverview(),
    fetchDepartmentSummaries(),
  ]);

  return (
    <div className="space-y-4">
      <TeamStatsGrid overview={overview} />
      <TeamDepartmentGrid departments={departments} />
    </div>
  );
};

export default TeamStatsSection;
export { TeamStatsSection };
