import { Suspense } from "react";
import {
  parseRiskFlagsSearchParams,
  type RawSearchParams,
  serializeRiskFlagsQuery,
} from "../../utils/riskFlagsQuery";
import { RiskFlagsStatsGrid } from "./RiskFlagsStatsGrid";
import { RiskFlagsStatsSection } from "./RiskFlagsStatsSection";
import { RiskFlagsTableSection } from "./RiskFlagsTableSection";
import { RiskFlagsTableSkeleton } from "./RiskFlagsTableSkeleton";

type RiskFlagsListPageProps = {
  searchParams?: RawSearchParams;
};

/**
 * The risk officer's case list.
 *
 * The status tab lives in the URL and is sent to the backend as a filter, so
 * only the selected tab's rows are transferred and a filtered view can be
 * bookmarked or shared. Nothing is filtered in the browser.
 */
const RiskFlagsListPage = ({ searchParams }: RiskFlagsListPageProps) => {
  const query = parseRiskFlagsSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Case KPI cards ─── */}
      <Suspense fallback={<RiskFlagsStatsGrid isLoading />}>
        <RiskFlagsStatsSection />
      </Suspense>

      {/* ─── 2. Case table — keyed so a tab change shows the skeleton ─── */}
      <Suspense
        key={serializeRiskFlagsQuery(query)}
        fallback={<RiskFlagsTableSkeleton />}
      >
        <RiskFlagsTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default RiskFlagsListPage;
export { RiskFlagsListPage };
export type { RiskFlagsListPageProps };
