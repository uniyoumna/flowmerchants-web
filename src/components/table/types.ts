import type {
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import type { useSortable } from "@dnd-kit/sortable";
import type {
  ColumnDef,
  Row,
  RowData,
  Table as TanStackTable,
} from "@tanstack/react-table";
import type * as React from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

// ─── Table Props ────────────────────────────────────────────────────────────

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
  /**
   * Persist sorting, filters and column visibility to `localStorage`.
   * Off by default — enable it only with a `storageKey` unique to this table.
   */
  persistState?: boolean;
  /** localStorage namespace. Must be unique per table when persisting. */
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

// ─── Subcomponent Props ─────────────────────────────────────────────────────

export type DataTableToolbarProps<TData> = {
  table: TanStackTable<TData>;
  isDropDownFilter?: boolean;
  onToggleSortMode?: () => void;
  isSortMode?: boolean;
  isSavingSortOrder?: boolean;
};

export type DataTableBodyProps<TData> = {
  table: TanStackTable<TData>;
  sensors: SensorDescriptor<SensorOptions>[];
  rowIds: string[];
  columnsLength: number;
  enableDragSort?: boolean;
  onDragEnd: (event: DragEndEvent) => void;
  onTableScroll: (event: React.UIEvent<HTMLTableSectionElement>) => void;
  onRowClick?: (row: TData) => void;
  selectedRowId?: string | number | null;
  emptyMessage?: string;
  enableInfiniteScroll?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  className?: string;
  TableCellClassName?: string;
};

export type DataTableSummaryFooterProps = {
  footerConfig?: FooterItem[];
  bgFooter?: string;
  footerClassName?: string;
};

export type SortableRowProps<TData> = {
  row: Row<TData>;
  children: React.ReactNode;
  enableDragSort: boolean;
  onClick?: () => void;
  className?: string;
};

export type SortableRowContextValue = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
};
