"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/table";
import { createTransactionsColumns } from "../../columns/transactionsColumns";
import {
  ALL_TRANSACTIONS,
  type TransactionsListResult,
  type TransactionsQueryParams,
} from "../../types";
import { TransactionsFilterBar } from "./TransactionsFilterBar";
import { TransactionsPagination } from "./TransactionsPagination";

type TransactionsTableCardProps = {
  result: TransactionsListResult;
  query: TransactionsQueryParams;
};

const TransactionsTableCard = ({
  result,
  query,
}: TransactionsTableCardProps) => {
  const router = useRouter();

  const columns = useMemo(() => createTransactionsColumns(), []);

  const isFiltered = Boolean(query.search) || query.status !== ALL_TRANSACTIONS;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Search & Status Pills (both server-side) ─── */}
      <TransactionsFilterBar scope={query.scope} activeStatus={query.status} />

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="border-t border-slate-100 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load transactions
          </p>
          <p className="mt-1 text-sm text-slate-500">{result.error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <DataTable
          data={result.data}
          columns={columns}
          enableSelection={false}
          showSequence={false}
          isDropDownFilter={false}
          emptyMessage={
            isFiltered
              ? "No transactions match these filters."
              : "No transactions yet."
          }
        />
      )}

      {/* ─── How much of the ledger the filters narrowed to ─── */}
      {!result.error && (
        <div className="border-t border-slate-100 px-6 py-3.5 text-xs font-medium text-slate-400">
          {result.totalItems} of {result.scopeTotal} transactions
        </div>
      )}

      {/* ─── Server-side Pagination ─── */}
      {!result.error && result.totalPages > 1 && (
        <TransactionsPagination
          totalItems={result.totalItems}
          totalPages={result.totalPages}
          currentPage={result.page}
          pageSize={result.pageSize}
        />
      )}
    </div>
  );
};

export default TransactionsTableCard;
export { TransactionsTableCard };
export type { TransactionsTableCardProps };
