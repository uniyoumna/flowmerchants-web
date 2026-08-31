"use client";

import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DataTable } from "@/components/table";
import { createMerchantsColumns } from "../../columns/merchantsColumns";
import type { MerchantsListResult } from "../../types";
import { MerchantsPagination } from "./MerchantsPagination";

type MerchantsTableCardProps = {
  result: MerchantsListResult;
  /** True when any filter is applied — changes the empty-state wording. */
  isFiltered: boolean;
};

const MerchantsTableCard = ({
  result,
  isFiltered,
}: MerchantsTableCardProps) => {
  const router = useRouter();

  const columns = useMemo(
    () =>
      createMerchantsColumns({
        onEdit: (merchant) => router.push(`/merchants/${merchant.id}`),
      }),
    [router],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Card Header ─── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Package className="size-4.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            List of Merchants ({result.totalItems})
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
            Could not load merchants
          </p>
          <p className="mt-1 text-sm text-slate-500">{result.error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
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
              ? "No merchants match these filters."
              : "No merchants yet."
          }
        />
      )}

      {/* ─── Server-side Pagination ─── */}
      {!result.error && (
        <MerchantsPagination
          totalItems={result.totalItems}
          totalPages={result.totalPages}
          currentPage={result.page}
          pageSize={result.pageSize}
        />
      )}
    </div>
  );
};

export default MerchantsTableCard;
export { MerchantsTableCard };
export type { MerchantsTableCardProps };
