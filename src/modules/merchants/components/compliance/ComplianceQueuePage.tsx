import { Suspense } from "react";
import {
  parseComplianceSearchParams,
  serializeComplianceQuery,
} from "../../utils/complianceQuery";
import type { RawSearchParams } from "../../utils/merchantsQuery";
import { ComplianceFilterBar } from "./ComplianceFilterBar";
import { ComplianceStatsGrid } from "./ComplianceStatsGrid";
import { ComplianceStatsSection } from "./ComplianceStatsSection";
import { ComplianceTableSection } from "./ComplianceTableSection";
import { ComplianceTableSkeleton } from "./ComplianceTableSkeleton";

type ComplianceQueuePageProps = {
  searchParams?: RawSearchParams;
};

/**
 * The compliance reviewer's worklist. Filters live in the URL, so a reviewer
 * can bookmark or share "everything overdue" and the server refetches that
 * slice — nothing is filtered or paginated in the browser.
 */
const ComplianceQueuePage = ({ searchParams }: ComplianceQueuePageProps) => {
  const query = parseComplianceSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Page Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Compliance Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and process merchant applications
        </p>
      </div>

      {/* ─── 2. Metric KPI Cards ─── */}
      <Suspense fallback={<ComplianceStatsGrid isLoading />}>
        <ComplianceStatsSection />
      </Suspense>

      {/* ─── 3. Search, Status & Ordering Bar (writes to the URL) ─── */}
      <Suspense>
        <ComplianceFilterBar />
      </Suspense>

      {/* ─── 4. Queue Table — keyed so a query change shows the skeleton ─── */}
      <Suspense
        key={serializeComplianceQuery(query)}
        fallback={<ComplianceTableSkeleton rows={query.pageSize} />}
      >
        <ComplianceTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default ComplianceQueuePage;
export { ComplianceQueuePage };
export type { ComplianceQueuePageProps };
