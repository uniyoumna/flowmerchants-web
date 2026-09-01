import { Suspense } from "react";
import {
  parseSettlementsSearchParams,
  type RawSearchParams,
  serializeSettlementsQuery,
} from "../../utils/settlementsQuery";
import { SettlementsStatsGrid } from "./SettlementsStatsGrid";
import { SettlementsStatsSection } from "./SettlementsStatsSection";
import { SettlementsTableSection } from "./SettlementsTableSection";
import { SettlementsTableSkeleton } from "./SettlementsTableSkeleton";

type SettlementsListPageProps = {
  searchParams?: RawSearchParams;
};

/**
 * The finance operator's settlement worklist.
 *
 * The status tab lives in the URL and is sent to the backend as a filter, so
 * only the selected tab's rows are ever transferred and a filtered view can be
 * bookmarked or shared. Nothing is filtered in the browser.
 */
const SettlementsListPage = ({ searchParams }: SettlementsListPageProps) => {
  const query = parseSettlementsSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Money KPI Cards ─── */}
      <Suspense fallback={<SettlementsStatsGrid isLoading />}>
        <SettlementsStatsSection />
      </Suspense>

      {/* ─── 2. Ticket table — keyed so a tab change shows the skeleton ─── */}
      <Suspense
        key={serializeSettlementsQuery(query)}
        fallback={<SettlementsTableSkeleton />}
      >
        <SettlementsTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default SettlementsListPage;
export { SettlementsListPage };
export type { SettlementsListPageProps };
