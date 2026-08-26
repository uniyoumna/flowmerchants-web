"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, GripHorizontal, GripVertical } from "lucide-react";
import * as React from "react";
import { BaseButton } from "@/components/base/BaseButton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EmptyValue } from "./EmptyValue";
import { SortableRow, useSortableRowContext } from "./SortableRow";
import { sequenceColumn } from "./sequenceColumn";
import { TablePagination } from "./TablePagination";
import { usePersistentState } from "./usePersistentState";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

export type FooterItem = {
  label: string;
  columnId: number | string;
  value: number | string;
  type?: string;
  icon?: React.ReactNode;
};

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];

  isDropDownFilter?: boolean;
  enableSelection?: boolean;
  storageKey?: string;

  footerConfig?: FooterItem[];
  bgFooter?: string;
  footerClassName?: string;

  totalItems?: number;
  totalPages?: number;
  current_page?: number;
  pageSize?: number;

  onPageChange?: (newPage: number) => void;
  showAll?: boolean;

  className?: string;
  bgHead?: string;
  showSequence?: boolean;

  enableDragSort?: boolean;
  onReorder?: (newData: TData[]) => void;
  getRowId?: (row: TData) => string | number;
  onToggleSortMode?: () => void;
  isSortMode?: boolean;
  isSavingSortOrder?: boolean;

  TableCellClassName?: string;

  enableInfiniteScroll?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => Promise<unknown> | undefined;
  infiniteScrollThreshold?: number;
  hidePaginationOnInfiniteScroll?: boolean;

  onRowClick?: (row: TData) => void;
  selectedRowId?: string | number | null;
  emptyMessage?: string;
  isRTL?: boolean;
};

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
  const [tableData, setTableData] = React.useState<TData[]>(data);

  React.useEffect(() => {
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

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
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

  const finalColumns = React.useMemo(() => {
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
    getRowId: (row) => String(getRowId(row)),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);

  const handleTableScroll = React.useCallback(
    (event: React.UIEvent<HTMLTableSectionElement>) => {
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
      {/* ─── Table Controls Header (Column Filter & Sort Mode) ─── */}
      {(isDropDownFilter || onToggleSortMode) && (
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
      )}

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

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rowIds}
                strategy={verticalListSortingStrategy}
              >
                <TableBody
                  onScroll={handleTableScroll}
                  className={cn("divide-y divide-slate-100", className)}
                >
                  {rows.length ? (
                    rows.map((row) => {
                      const rowId = (row.original as { id?: string | number })
                        .id;
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
                        colSpan={finalColumns.length}
                        className="h-32 text-center text-sm font-medium text-slate-400"
                      >
                        {emptyMessage}
                      </TableCell>
                    </TableRow>
                  )}

                  {enableInfiniteScroll && rows.length > 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={finalColumns.length}
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
          </Table>
        </div>

        {/* ─── Optional Footer Summary Row ─── */}
        {footerConfig && footerConfig.length > 0 && (
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-8 border-t border-slate-100 bg-slate-50/60 py-3 px-4 text-xs font-semibold text-slate-700",
              bgFooter,
              footerClassName,
            )}
          >
            {footerConfig.map((item) => (
              <div
                key={String(item.columnId)}
                className="flex items-center gap-2"
              >
                {item.icon}
                <span className="text-slate-500 font-medium">
                  {item.label}:
                </span>
                <span className="font-bold text-slate-900">
                  {item.value} {item.type ?? ""}
                </span>
              </div>
            ))}
          </div>
        )}
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
export type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState };
