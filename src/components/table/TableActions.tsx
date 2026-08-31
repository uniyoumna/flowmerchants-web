"use client";

import { Ellipsis, Eye, SquarePen, Trash2 } from "lucide-react";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ExtraAction = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
};

type TableActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  variant?: "inline" | "dropdown";
  extraActions?: ExtraAction[];
  className?: string;
};

const TableActions = ({
  onEdit,
  onDelete,
  onView,
  variant = "inline",
  extraActions = [],
  className,
}: TableActionsProps) => {
  const hasActions = onView || onEdit || onDelete || extraActions.length > 0;
  if (!hasActions) return null;

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          aria-label="Row actions"
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer outline-none"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-4.5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40 rounded-xl border border-slate-100 bg-white p-1 shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {onView && (
            <DropdownMenuItem
              onClick={onView}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <Eye className="size-4 text-slate-400" />
              <span>View</span>
            </DropdownMenuItem>
          )}

          {onEdit && (
            <DropdownMenuItem
              onClick={onEdit}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <SquarePen className="size-4 text-slate-400" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}

          {extraActions.map((action) => (
            <DropdownMenuItem
              key={action.key}
              onClick={action.onClick}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50",
                action.destructive &&
                  "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
              )}
            >
              {action.icon}
              <span>{action.label}</span>
            </DropdownMenuItem>
          ))}

          {onDelete && (
            <>
              {(onView || onEdit || extraActions.length > 0) && (
                <DropdownMenuSeparator className="my-1 border-t border-slate-100" />
              )}
              <DropdownMenuItem
                onClick={onDelete}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="size-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onView && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          aria-label="View"
          className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <Eye className="size-4" />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Edit"
          className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <SquarePen className="size-4" />
        </button>
      )}

      {extraActions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          aria-label={action.label}
          className={cn(
            "flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer",
            action.destructive && "hover:bg-rose-50 hover:text-rose-600",
          )}
        >
          {action.icon}
        </button>
      ))}

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete"
          className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
};

export default TableActions;
export { TableActions };
export type { ExtraAction, TableActionsProps };
