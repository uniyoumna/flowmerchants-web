import { Suspense } from "react";
import {
  parseTeamSearchParams,
  type RawSearchParams,
  serializeTeamQuery,
} from "../../utils/teamQuery";
import { TeamDepartmentGrid } from "./TeamDepartmentGrid";
import { TeamStatsGrid } from "./TeamStatsGrid";
import { TeamStatsSection } from "./TeamStatsSection";
import { TeamTableSection } from "./TeamTableSection";
import { TeamTableSkeleton } from "./TeamTableSkeleton";

type TeamMembersPageProps = {
  searchParams?: RawSearchParams;
  /**
   * True on `/team/invite`. The sidebar links straight there, so the invite
   * dialog is a route rather than component state — it survives a refresh and
   * can be linked to, and browser back closes it.
   */
  isInviteOpen?: boolean;
};

const TeamMembersPage = ({
  searchParams,
  isInviteOpen = false,
}: TeamMembersPageProps) => {
  const query = parseTeamSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Headcount, then the same headcount split by department ─── */}
      <Suspense
        fallback={
          <div className="space-y-4">
            <TeamStatsGrid isLoading />
            <TeamDepartmentGrid isLoading />
          </div>
        }
      >
        <TeamStatsSection />
      </Suspense>

      {/* ─── 2. Members — keyed so a search change shows the skeleton ─── */}
      <Suspense
        key={serializeTeamQuery(query)}
        fallback={<TeamTableSkeleton />}
      >
        <TeamTableSection query={query} isInviteOpen={isInviteOpen} />
      </Suspense>
    </div>
  );
};

export default TeamMembersPage;
export { TeamMembersPage };
export type { TeamMembersPageProps };
