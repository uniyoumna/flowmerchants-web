import { Suspense } from "react";
import {
  parseMerchantsSearchParams,
  type RawSearchParams,
  serializeMerchantsQuery,
} from "../../utils/merchantsQuery";
import MerchantsFilterBar from "./MerchantsFilterBar";
import MerchantsListHeader from "./MerchantsListHeader";
import { MerchantsStatsGrid } from "./MerchantsStatsGrid";
import { MerchantsStatsSection } from "./MerchantsStatsSection";
import { MerchantsTableSection } from "./MerchantsTableSection";
import { MerchantsTableSkeleton } from "./MerchantsTableSkeleton";

type MerchantsListPageProps = {
  searchParams?: RawSearchParams;
};

const MerchantsListPage = ({ searchParams }: MerchantsListPageProps) => {
  const query = parseMerchantsSearchParams(searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. Page Header (Title + Add Button) ─── */}
      <MerchantsListHeader />

      {/* ─── 2. Metric KPI Cards ─── */}
      <Suspense fallback={<MerchantsStatsGrid isLoading />}>
        <MerchantsStatsSection />
      </Suspense>

      {/* ─── 3. Search, Status & Ordering Bar (writes to the URL) ─── */}
      <Suspense>
        <MerchantsFilterBar />
      </Suspense>

      {/* ─── 4. Table Card — keyed so a query change shows the skeleton ─── */}
      <Suspense
        key={serializeMerchantsQuery(query)}
        fallback={<MerchantsTableSkeleton rows={query.pageSize} />}
      >
        <MerchantsTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default MerchantsListPage;
export { MerchantsListPage };
