"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildPageItems } from "@/utils/pagination";

type TablePaginationProps = {
  totalPages?: number;
  current_page?: number;
  onPageChange?: (newPage: number) => void;
  className?: string;

  /**
   * Pass `totalItems` + `pageSize` to render the "Showing 1 to 10 of 42 …"
   * summary. Omit them and the pager renders on its own.
   */
  totalItems?: number;
  pageSize?: number;
  /** Plural noun used by the summary line, e.g. "merchants". */
  itemLabel?: string;

  /** Accessible name for the `<nav>` — override when a page has several pagers. */
  ariaLabel?: string;
  /** Dims and disables the controls while a navigation is in flight. */
  isPending?: boolean;
};

const TablePagination = ({
  current_page = 1,
  totalPages = 1,
  onPageChange,
  className,
  totalItems,
  pageSize,
  itemLabel = "items",
  ariaLabel = "Pagination",
  isPending = false,
}: TablePaginationProps) => {
  const pages = Math.max(1, totalPages);

  const showSummary = totalItems !== undefined && pageSize !== undefined;
  const startItem =
    !showSummary || totalItems === 0 ? 0 : (current_page - 1) * pageSize + 1;
  const endItem = showSummary
    ? Math.min(current_page * pageSize, totalItems)
    : 0;

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), pages);
    if (target === current_page) return;
    onPageChange?.(target);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 py-4 px-2 select-none",
        showSummary ? "justify-between" : "justify-end",
        className,
      )}
    >
      {/* ─── Range Summary ─── */}
      {showSummary && (
        <div className="text-xs text-slate-500">
          Showing {startItem} to {endItem} of {totalItems} {itemLabel}
        </div>
      )}

      {/* ─── Navigation ─── */}
      <nav
        aria-label={ariaLabel}
        data-pending={isPending ? "" : undefined}
        className="flex items-center gap-2 data-pending:opacity-60"
      >
        {/* Previous Page */}
        <button
          type="button"
          onClick={() => goToPage(current_page - 1)}
          disabled={current_page <= 1 || isPending}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="mr-1 size-3.5" />
          Previous
        </button>

        {/* Windowed Page Numbers */}
        {buildPageItems(current_page, pages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis slots have no stable id
              key={`ellipsis-${index}`}
              className="flex size-8 items-center justify-center text-xs text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goToPage(item)}
              disabled={isPending}
              aria-current={item === current_page ? "page" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer",
                item === current_page
                  ? "bg-linear-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100",
              )}
            >
              {item}
            </button>
          ),
        )}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => goToPage(current_page + 1)}
          disabled={current_page >= pages || isPending}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        >
          Next
          <ChevronRight className="ml-1 size-3.5" />
        </button>
      </nav>
    </div>
  );
};

export default TablePagination;
export { TablePagination };
export type { TablePaginationProps };
