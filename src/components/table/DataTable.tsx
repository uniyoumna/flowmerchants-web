"use client";

import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { GripHorizontal } from "lucide-react";
import { type UIEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableBody } from "./DataTableBody";
import { DataTableSummaryFooter } from "./DataTableSummaryFooter";
import { DataTableToolbar } from "./DataTableToolbar";
import { useSortableRowContext } from "./SortableRow";
import { sequenceColumn } from "./sequenceColumn";
import { TablePagination } from "./TablePagination";
import type { DataTableProps, FooterItem } from "./types";
import { usePersistentState } from "./usePersistentState";

const DragHandle = () => {
  const { attributes, listeners } = useSortableRowContext();

  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      onClick={(event) => event.stopPropagation()}
      className="flex w-full items-center justify-center cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700"
    >
      <GripHorizontal className="size-5" />
    </button>
  );
};

const DataTable = <TData,>({
  data,
  columns,

  enableSelection = false,
  isDropDownFilter = true,
  storageKey = "flow-datatable",

  footerConfig,
  bgFooter,
  footerClassName,

  current_page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  showAll = false,

  className,
  bgHead,
  showSequence = false,

  enableDragSort = false,
  onReorder,
  getRowId = (row) =>
    (row as { id?: string | number }).id ?? Math.random().toString(),
  onToggleSortMode,
  isSortMode = false,
  isSavingSortOrder = false,

  TableCellClassName,

  enableInfiniteScroll = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  infiniteScrollThreshold = 80,
  hidePaginationOnInfiniteScroll = true,

  onRowClick,
  selectedRowId,
  emptyMessage = "No data available yet",
  isRTL = false,
}: DataTableProps<TData>) => {
  const [tableData, setTableData] = useState<TData[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: {
      active: { id: string | number };
      over: { id: string | number } | null;
    }) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = tableData.findIndex(
        (item) => String(getRowId(item)) === active.id,
      );

      const newIndex = tableData.findIndex(
        (item) => String(getRowId(item)) === over.id,
      );

      if (oldIndex === -1 || newIndex === -1) return;

      const newData = arrayMove(tableData, oldIndex, newIndex);

      setTableData(newData);
      onReorder?.(newData);
    },
    [getRowId, onReorder, tableData],
  );

  const [sorting, setSorting] = usePersistentState<SortingState>(
    `${storageKey}-sorting`,
    [],
  );

  const [columnFilters, setColumnFilters] =
    usePersistentState<ColumnFiltersState>(`${storageKey}-filters`, []);

  const [columnVisibility, setColumnVisibility] =
    usePersistentState<VisibilityState>(`${storageKey}-visibility`, {});

  const [rowSelection, setRowSelection] = usePersistentState<
    Record<string, boolean>
  >(`${storageKey}-selection`, {});

  const finalColumns = useMemo(() => {
    const cols: ColumnDef<TData, unknown>[] = [];

    const seqCol = sequenceColumn<TData>(
      current_page || 1,
      pageSize,
      showSequence && !enableDragSort,
    );
    if (seqCol) {
      cols.push(seqCol);
    }

    if (enableDragSort) {
      cols.unshift({
        id: "drag-handle",
        header: () => (
          <div className="flex items-center justify-center text-xs font-semibold text-slate-400">
            Sort
          </div>
        ),
        cell: () => <DragHandle />,
        size: 50,
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, unknown>);
    }

    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(Boolean(value))
              }
              aria-label="Select all rows"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
              aria-label="Select row"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, unknown>);
    }

    return [...cols, ...columns];
  }, [
    columns,
    current_page,
    enableDragSort,
    enableSelection,
    pageSize,
    showSequence,
  ]);

  const table = useReactTable<TData>({
    data: tableData,
    columns: finalColumns,
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: enableSelection,
    getRowId: (row) => String(getRowId(row)),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: enableSelection ? rowSelection : {},
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowIds = useMemo(
    () => table.getRowModel().rows.map((row) => row.id),
    [table],
  );

  const handleTableScroll = useCallback(
    (event: UIEvent<HTMLTableSectionElement>) => {
      if (!enableInfiniteScroll) return;
      if (!onLoadMore) return;
      if (!hasNextPage) return;
      if (isFetchingNextPage) return;

      const target = event.currentTarget;
      const userScrolled = target.scrollTop > 0;
      const distanceFromBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;
      const reachedBottom = distanceFromBottom <= infiniteScrollThreshold;

      if (userScrolled && reachedBottom) {
        onLoadMore();
      }
    },
    [
      enableInfiniteScroll,
      hasNextPage,
      infiniteScrollThreshold,
      isFetchingNextPage,
      onLoadMore,
    ],
  );

  const shouldShowPagination =
    !showAll &&
    totalItems > pageSize &&
    onPageChange &&
    (!enableInfiniteScroll || !hidePaginationOnInfiniteScroll);

  return (
    <div className={cn("w-full max-w-full space-y-3", isRTL && "rtl")}>
      {/* ─── Table Controls Header ─── */}
      <DataTableToolbar
        table={table}
        isDropDownFilter={isDropDownFilter}
        onToggleSortMode={onToggleSortMode}
        isSortMode={isSortMode}
        isSavingSortOrder={isSavingSortOrder}
      />

      {/* ─── Table Frame ─── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-slate-100 bg-slate-50/75 hover:bg-slate-50/75"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-11 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap",
                        bgHead,
                        header.column.columnDef.meta?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <DataTableBody
              table={table}
              sensors={sensors}
              rowIds={rowIds}
              columnsLength={finalColumns.length}
              enableDragSort={enableDragSort}
              onDragEnd={handleDragEnd}
              onTableScroll={handleTableScroll}
              onRowClick={onRowClick}
              selectedRowId={selectedRowId}
              emptyMessage={emptyMessage}
              enableInfiniteScroll={enableInfiniteScroll}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              className={className}
              TableCellClassName={TableCellClassName}
            />
          </Table>
        </div>

        {/* ─── Optional Footer Summary Row ─── */}
        <DataTableSummaryFooter
          footerConfig={footerConfig}
          bgFooter={bgFooter}
          footerClassName={footerClassName}
        />
      </div>

      {/* ─── Pagination ─── */}
      {shouldShowPagination && (
        <TablePagination
          current_page={current_page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
export { DataTable };
export type { DataTableProps, FooterItem };
export type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
