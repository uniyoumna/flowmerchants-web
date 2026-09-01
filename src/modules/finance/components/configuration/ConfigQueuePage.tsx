import { Suspense } from "react";
import {
  parseConfigSearchParams,
  type RawSearchParams,
  serializeConfigQuery,
} from "../../utils/financeQuery";
import { ConfigFilterBar } from "./ConfigFilterBar";
import { ConfigStatsGrid } from "./ConfigStatsGrid";
import { ConfigStatsSection } from "./ConfigStatsSection";
import { ConfigTableSection } from "./ConfigTableSection";
import { ConfigTableSkeleton } from "./ConfigTableSkeleton";

type ConfigQueuePageProps = {
  searchParams?: RawSearchParams;
};

/**
 * Merchants waiting for their financial parameters to be set.
 *
 * A merchant lands here once compliance has approved it and leaves once its
 * configuration is submitted. Filters live in the URL and the server refetches
 * that slice — nothing is filtered in the browser.
 */
const ConfigQueuePage = ({ searchParams }: ConfigQueuePageProps) => {
  const query = parseConfigSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Page Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Merchant Configuration
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Set financial parameters for approved merchants
        </p>
      </div>

      {/* ─── 2. Metric KPI Cards ─── */}
      <Suspense fallback={<ConfigStatsGrid isLoading />}>
        <ConfigStatsSection />
      </Suspense>

      {/* ─── 3. Search, Status & Ordering Bar (writes to the URL) ─── */}
      <Suspense>
        <ConfigFilterBar />
      </Suspense>

      {/* ─── 4. Queue Table — keyed so a query change shows the skeleton ─── */}
      <Suspense
        key={serializeConfigQuery(query)}
        fallback={<ConfigTableSkeleton rows={query.pageSize} />}
      >
        <ConfigTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default ConfigQueuePage;
export { ConfigQueuePage };
export type { ConfigQueuePageProps };
