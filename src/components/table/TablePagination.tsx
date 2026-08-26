"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TablePaginationProps = {
  totalPages?: number;
  current_page?: number;
  onPageChange?: (newPage: number) => void;
  className?: string;
};

const TablePagination = ({
  current_page = 1,
  totalPages = 1,
  onPageChange,
  className,
}: TablePaginationProps) => {
  const pages = Math.max(1, totalPages);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 py-4 px-2 select-none",
        className,
      )}
    >
      {/* ─── Page Jump Select ─── */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Page</span>
        <Select
          value={String(current_page)}
          onValueChange={(val) => val && onPageChange?.(Number(val))}
        >
          <SelectTrigger className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="max-h-56 min-w-16 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
            {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
              <SelectItem
                key={page}
                value={String(page)}
                className="cursor-pointer rounded-lg text-xs"
              >
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-slate-400">
          of <span className="font-semibold text-slate-700">{pages}</span>
        </span>
      </div>

      {/* ─── Navigation Buttons ─── */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(1)}
          disabled={current_page <= 1}
          aria-label="First page"
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          <ChevronsLeft className="size-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, current_page - 1))}
          disabled={current_page <= 1}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Current Page Pill */}
        <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-linear-to-r from-[#7C3AED] to-[#A855F7] px-2.5 text-xs font-bold text-white shadow-xs">
          {current_page}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(pages, current_page + 1))}
          disabled={current_page >= pages}
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange?.(pages)}
          disabled={current_page >= pages}
          aria-label="Last page"
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
export { TablePagination };
export type { TablePaginationProps };
