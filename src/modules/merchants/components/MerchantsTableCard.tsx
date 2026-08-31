"use client";

import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { type ColumnDef, DataTable } from "@/components/table";
import type { Merchant } from "../types";

type MerchantsTableCardProps = {
  data: Merchant[];
  columns: ColumnDef<Merchant, unknown>[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
};

const MerchantsTableCard = ({
  data,
  columns,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  isLoading = false,
}: MerchantsTableCardProps) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Table Card Top Header (Matches Screenshot 1) ─── */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Package className="size-4.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            List of Merchants ({totalItems})
          </h2>
        </div>

        <div className="text-xs font-medium text-slate-400">
          Page {currentPage} of {Math.max(1, totalPages)}
        </div>
      </div>

      {/* ─── Table Body ─── */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#7C3AED] shadow-md border border-slate-100">
              <span className="size-2 rounded-full bg-[#7C3AED] animate-ping" />
              Loading merchants...
            </div>
          </div>
        )}

        <DataTable
          data={data}
          columns={columns}
          enableSelection={false}
          showSequence={false}
          isDropDownFilter={false}
        />
      </div>

      {/* ─── Table Card Bottom Pagination (Matches Screenshot 3) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-5 py-3.5 select-none">
        <div className="text-xs text-slate-500">
          Showing {startItem} to {endItem} of {totalItems} merchants
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="mr-1 size-3.5" />
            Previous
          </button>

          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(
            (pageNum) => {
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#7C3AED] text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            },
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            Next
            <ChevronRight className="ml-1 size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantsTableCard;
export { MerchantsTableCard };
export type { MerchantsTableCardProps };
