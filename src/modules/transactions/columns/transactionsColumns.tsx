import type { ColumnDef } from "@/components/table";
import { formatAmount } from "@/utils/formatters";
import { TransactionStatusBadge } from "../components/shared/TransactionStatusBadge";
import { TransactionTypeBadge } from "../components/shared/TransactionTypeBadge";
import type { Transaction } from "../types";

export function createTransactionsColumns(): ColumnDef<Transaction, unknown>[] {
  return [
    {
      accessorKey: "reference",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-600">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: "merchantName",
      header: "Merchant / Branch",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-900">
            {row.original.merchantName}
          </span>
          <span className="text-xs font-normal text-slate-400">
            {row.original.branchName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {row.original.customerName}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <TransactionTypeBadge type={row.original.type} />,
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-700">
          {row.original.product}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold whitespace-nowrap text-slate-900">
          {row.original.currency} {formatAmount(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-400">
          {row.original.createdAt}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <TransactionStatusBadge status={row.original.status} />
      ),
    },
  ];
}
