"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import type { DataTableBodyProps } from "@/components/table/types";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyValue } from "./EmptyValue";
import { SortableRow } from "./SortableRow";

export function DataTableBody<TData>({
  table,
  sensors,
  rowIds,
  columnsLength,
  enableDragSort = false,
  onDragEnd,
  onTableScroll,
  onRowClick,
  selectedRowId,
  emptyMessage = "No data available yet",
  enableInfiniteScroll = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  className,
  TableCellClassName,
}: DataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
        <TableBody
          onScroll={onTableScroll}
          className={cn("divide-y divide-slate-100", className)}
        >
          {rows.length ? (
            rows.map((row) => {
              const rowId = (row.original as { id?: string | number }).id;
              const isSelected =
                selectedRowId !== undefined &&
                selectedRowId !== null &&
                String(selectedRowId) === String(rowId);

              return (
                <SortableRow
                  key={row.id}
                  row={row}
                  enableDragSort={enableDragSort}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    isSelected && "bg-purple-50/70",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const customCell = cell.column.columnDef.cell;

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "px-4 py-3.5 text-sm text-slate-700",
                          cell.column.columnDef.meta?.className,
                          TableCellClassName,
                        )}
                      >
                        {(() => {
                          if (customCell) {
                            const rendered = flexRender(
                              customCell,
                              cell.getContext(),
                            );
                            if (
                              rendered === null ||
                              rendered === undefined ||
                              rendered === ""
                            ) {
                              return <EmptyValue />;
                            }
                            return rendered;
                          }

                          const value = cell.getValue();

                          if (
                            value === null ||
                            value === undefined ||
                            value === ""
                          ) {
                            return <EmptyValue />;
                          }

                          return String(value);
                        })()}
                      </TableCell>
                    );
                  })}
                </SortableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsLength}
                className="h-32 text-center text-sm font-medium text-slate-400"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}

          {enableInfiniteScroll && rows.length > 0 && (
            <TableRow>
              <TableCell
                colSpan={columnsLength}
                className="py-4 text-center text-xs text-slate-400"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                    ? ""
                    : "No more data"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </SortableContext>
    </DndContext>
  );
}
