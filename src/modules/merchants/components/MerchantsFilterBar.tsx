"use client";

import { Loader2, Search } from "lucide-react";
import { BaseSelect } from "@/components/base/BaseSelect";
import { MERCHANT_SORT_OPTIONS, MERCHANT_STATUS_OPTIONS } from "../constants";

type MerchantsFilterBarProps = {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  isLoading?: boolean;
};

const MerchantsFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  isLoading = false,
}: MerchantsFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
      {/* ─── Search Input ─── */}
      <div className="flex w-full max-w-sm items-center gap-2.5 rounded-lg bg-gray-100 border border-slate-200/80 px-3.5 py-2 transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-purple-600 shrink-0" />
        ) : (
          <Search className="size-4 text-slate-400 shrink-0" />
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search merchant by name, code..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
        />
      </div>

      {/* ─── Status & Sort By Selects ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <BaseSelect
          value={status}
          onValueChange={(val) => onStatusChange(val || "all")}
          options={MERCHANT_STATUS_OPTIONS}
          className="w-48"
        />

        <BaseSelect
          value={sortBy}
          onValueChange={(val) => onSortByChange(val || "none")}
          options={MERCHANT_SORT_OPTIONS}
          className="w-40"
        />
      </div>
    </div>
  );
};

export default MerchantsFilterBar;
export { MerchantsFilterBar };
export type { MerchantsFilterBarProps };
