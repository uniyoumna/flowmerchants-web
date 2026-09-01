"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/table";
import { createConfigWorkflowsColumns } from "../../columns/configWorkflowsColumns";
import type { ConfigQueueResult } from "../../types";

type ConfigTableCardProps = {
  result: ConfigQueueResult;
  /** True when any filter is applied — changes the empty-state wording. */
  isFiltered: boolean;
};

const ConfigTableCard = ({ result, isFiltered }: ConfigTableCardProps) => {
  const router = useRouter();

  const columns = useMemo(() => createConfigWorkflowsColumns(), []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Card Header ─── */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Merchant Configuration
        </h2>
      </div>

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load the configuration queue
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
              ? "No workflows match these filters."
              : "Nothing is waiting for configuration."
          }
        />
      )}

      {/* ─── Footer count ─── */}
      {!result.error && (
        <div className="border-t border-slate-100 px-6 py-3.5 text-xs font-medium text-slate-400">
          {result.totalItems}{" "}
          {result.totalItems === 1 ? "workflow" : "workflows"} shown
        </div>
      )}
    </div>
  );
};

export default ConfigTableCard;
export { ConfigTableCard };
export type { ConfigTableCardProps };
