"use client";

import { ChevronDown, GripVertical } from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";
import type { DataTableToolbarProps } from "@/components/table/types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DataTableToolbar<TData>({
  table,
  isDropDownFilter = true,
  onToggleSortMode,
  isSortMode = false,
  isSavingSortOrder = false,
}: DataTableToolbarProps<TData>) {
  if (!isDropDownFilter && !onToggleSortMode) return null;

  return (
    <div className="flex items-center justify-end gap-3">
      {onToggleSortMode && (
        <BaseButton
          variant={isSortMode ? "outline" : "default"}
          onClick={onToggleSortMode}
          disabled={isSavingSortOrder}
          className="h-9 gap-1.5 rounded-xl text-xs font-semibold"
        >
          <GripVertical className="size-4" />
          {isSortMode ? "Exit Sort Mode" : "Sort Rows"}
        </BaseButton>
      )}

      {isDropDownFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
          >
            <span>Columns</span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl border border-slate-100 bg-white p-1 shadow-lg z-50"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="cursor-pointer capitalize text-xs rounded-lg px-2.5 py-1.5"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(Boolean(value))
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
