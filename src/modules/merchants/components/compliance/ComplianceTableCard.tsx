"use client";

import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/table";
import { createComplianceColumns } from "../../columns/complianceColumns";
import type { ComplianceQueueResult } from "../../types";
import { CompliancePagination } from "./CompliancePagination";

type ComplianceTableCardProps = {
  result: ComplianceQueueResult;
  /** True when any filter is applied — changes the empty-state wording. */
  isFiltered: boolean;
};

const ComplianceTableCard = ({
  result,
  isFiltered,
}: ComplianceTableCardProps) => {
  const router = useRouter();

  const columns = useMemo(() => createComplianceColumns(), []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Card Header ─── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <ClipboardCheck className="size-4.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Compliance Queue ({result.totalItems})
          </h2>
        </div>

        <div className="text-xs font-medium text-slate-400">
          Page {result.page} of {Math.max(1, result.totalPages)}
        </div>
      </div>

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="px-5 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load the compliance queue
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
              ? "No submissions match these filters."
              : "Nothing is waiting for review."
          }
        />
      )}

      {/* ─── Server-side Pagination ─── */}
      {!result.error && (
        <CompliancePagination
          totalItems={result.totalItems}
          totalPages={result.totalPages}
          currentPage={result.page}
          pageSize={result.pageSize}
        />
      )}
    </div>
  );
};

export default ComplianceTableCard;
export { ComplianceTableCard };
export type { ComplianceTableCardProps };
