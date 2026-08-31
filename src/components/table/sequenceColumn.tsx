import type { ColumnDef } from "@tanstack/react-table";

const sequenceColumn = <TData,>(
  currentPage = 1,
  pageSize = 10,
  enabled = true,
): ColumnDef<TData, unknown> | null => {
  if (!enabled) return null;

  return {
    id: "sequence",
    header: () => (
      <span className="w-8 text-center text-xs font-semibold text-slate-400">
        #
      </span>
    ),
    cell: ({ row }) => {
      const index = (currentPage - 1) * pageSize + row.index + 1;
      return (
        <span className="w-8 text-center font-mono text-xs text-slate-400">
          {index}
        </span>
      );
    },
    size: 48,
    enableSorting: false,
    enableHiding: false,
  };
};

export default sequenceColumn;
export { sequenceColumn };
