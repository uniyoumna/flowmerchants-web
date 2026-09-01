import type { ColumnDef } from "@/components/table";
import { cn } from "@/lib/utils";
import { SettlementAmount } from "../components/shared/SettlementAmount";
import { SettlementStatusBadge } from "../components/shared/SettlementStatusBadge";
import { CLOSEABLE_STATUSES, RECEIPT_STATUSES } from "../constants";
import type { SettlementTicket } from "../types";

type CreateSettlementsColumnsOptions = {
  /** Marks a due or overdue ticket as settled. */
  onCloseTicket?: (ticket: SettlementTicket) => void;
  /** Opens the transfer receipt for a closed ticket. */
  onViewReceipt?: (ticket: SettlementTicket) => void;
  /** Ticket currently being closed — its button shows the pending state. */
  pendingTicketId?: string | null;
};

export function createSettlementsColumns({
  onCloseTicket,
  onViewReceipt,
  pendingTicketId,
}: CreateSettlementsColumnsOptions = {}): ColumnDef<
  SettlementTicket,
  unknown
>[] {
  return [
    {
      accessorKey: "ticketId",
      header: "Ticket ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-700">
          {row.original.ticketId}
        </span>
      ),
    },
    {
      accessorKey: "merchantName",
      header: "Merchant",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">
            {row.original.merchantName}
          </span>
          <span className="font-mono text-xs font-normal text-slate-400">
            {row.original.merchantCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-600">
          {row.original.period}
        </span>
      ),
    },
    {
      accessorKey: "gross",
      header: "Gross",
      cell: ({ row }) => <SettlementAmount value={row.original.gross} />,
    },
    {
      accessorKey: "refunds",
      header: "Refunds",
      cell: ({ row }) => (
        <SettlementAmount value={row.original.refunds} variant="refund" />
      ),
    },
    {
      accessorKey: "fees",
      header: "Fees",
      cell: ({ row }) => (
        <SettlementAmount value={row.original.fees} variant="deduction" />
      ),
    },
    {
      accessorKey: "net",
      header: "Net",
      cell: ({ row }) => (
        <SettlementAmount value={row.original.net} variant="net" />
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        // An overdue date is the one number a finance operator must not miss.
        <span
          className={cn(
            "font-mono text-xs whitespace-nowrap",
            row.original.status === "overdue"
              ? "font-bold text-rose-600"
              : "text-slate-500",
          )}
        >
          {row.original.dueDate}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <SettlementStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "bankAccount",
      header: "Bank Account",
      cell: ({ row }) => (
        <span
          title={row.original.bankAccount}
          className="block max-w-44 truncate text-sm text-slate-500"
        >
          {row.original.bankAccount}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ticket = row.original;
        const isPending = pendingTicketId === ticket.id;

        if (CLOSEABLE_STATUSES.includes(ticket.status)) {
          return (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onCloseTicket?.(ticket)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-[#7C3AED]/30 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Closing..." : "Close Ticket"}
            </button>
          );
        }

        if (RECEIPT_STATUSES.includes(ticket.status)) {
          return (
            <button
              type="button"
              onClick={() => onViewReceipt?.(ticket)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-50"
            >
              View Receipt
            </button>
          );
        }

        // Processing, held and upcoming tickets are not actionable from here.
        return null;
      },
    },
  ];
}
