"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Row } from "@tanstack/react-table";
import { createContext, useContext, useMemo } from "react";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SortableRowContextValue = {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
};

const SortableRowContext = createContext<SortableRowContextValue | null>(null);

export const useSortableRowContext = () => {
  const context = useContext(SortableRowContext);
  if (!context) {
    throw new Error("useSortableRowContext must be used inside SortableRow");
  }
  return context;
};

type SortableRowProps<TData> = {
  row: Row<TData>;
  children: React.ReactNode;
  enableDragSort: boolean;
  onClick?: () => void;
  className?: string;
};

const SortableRow = <TData,>({
  row,
  children,
  enableDragSort,
  onClick,
  className,
}: SortableRowProps<TData>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    disabled: !enableDragSort,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const contextValue = useMemo(
    () => ({
      attributes,
      listeners,
    }),
    [attributes, listeners],
  );

  return (
    <SortableRowContext.Provider value={contextValue}>
      <TableRow
        ref={setNodeRef}
        style={style}
        onClick={onClick}
        data-state={row.getIsSelected() ? "selected" : undefined}
        className={cn(
          "transition-colors",
          onClick && "cursor-pointer hover:bg-slate-50/70",
          row.getIsSelected() && "bg-purple-50/50",
          className,
        )}
      >
        {children}
      </TableRow>
    </SortableRowContext.Provider>
  );
};

export default SortableRow;
export { SortableRow };
export type { SortableRowProps };
