import { Suspense } from "react";
import type { TransactionScope } from "../../types";
import {
  parseTransactionsSearchParams,
  type RawSearchParams,
  serializeTransactionsQuery,
} from "../../utils/transactionsQuery";
import { TransactionsStatsGrid } from "./TransactionsStatsGrid";
import { TransactionsStatsSection } from "./TransactionsStatsSection";
import { TransactionsTableSection } from "./TransactionsTableSection";
import { TransactionsTableSkeleton } from "./TransactionsTableSkeleton";

type TransactionsListPageProps = {
  /** Fixed by the route: All, Purchases or Refunds. */
  scope: TransactionScope;
  searchParams?: RawSearchParams;
};

/**
 * One screen behind three routes.
 *
 * All, Purchases and Refunds differ only in which slice of the ledger they
 * show, so they share this page and pass a different `scope`. The scope comes
 * from the route rather than the query string — it is what the page *is*, not
 * a filter the user chose — while search and status live in the URL and are
 * sent to the backend.
 */
const TransactionsListPage = ({
  scope,
  searchParams,
}: TransactionsListPageProps) => {
  const query = parseTransactionsSearchParams(scope, searchParams);

  return (
    <div className="space-y-6">
      {/* ─── 1. KPI cards, scoped to this page ─── */}
      <Suspense key={scope} fallback={<TransactionsStatsGrid isLoading />}>
        <TransactionsStatsSection scope={scope} />
      </Suspense>

      {/* ─── 2. Filters + table — keyed so a change shows the skeleton ─── */}
      <Suspense
        key={serializeTransactionsQuery(query)}
        fallback={<TransactionsTableSkeleton rows={query.pageSize} />}
      >
        <TransactionsTableSection query={query} />
      </Suspense>
    </div>
  );
};

export default TransactionsListPage;
export { TransactionsListPage };
export type { TransactionsListPageProps };
