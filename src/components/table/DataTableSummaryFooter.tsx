"use client";

import type { DataTableSummaryFooterProps } from "@/components/table/types";
import { cn } from "@/lib/utils";

export function DataTableSummaryFooter({
  footerConfig,
  bgFooter,
  footerClassName,
}: DataTableSummaryFooterProps) {
  if (!footerConfig || footerConfig.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-8 border-t border-slate-100 bg-slate-50/60 py-3 px-4 text-xs font-semibold text-slate-700",
        bgFooter,
        footerClassName,
      )}
    >
      {footerConfig.map((item) => (
        <div key={String(item.columnId)} className="flex items-center gap-2">
          {item.icon}
          <span className="text-slate-500 font-medium">{item.label}:</span>
          <span className="font-bold text-slate-900">
            {item.value} {item.type ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}
