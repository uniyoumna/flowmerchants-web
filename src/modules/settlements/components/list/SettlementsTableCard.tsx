"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/table";
import { closeSettlementTicketAction } from "../../actions/settlementsActions";
import { createSettlementsColumns } from "../../columns/settlementsColumns";
import {
  ALL_SETTLEMENTS,
  type SettlementsListResult,
  type SettlementsQueryParams,
  type SettlementTicket,
} from "../../types";
import { SettlementsExportButton } from "./SettlementsExportButton";
import { SettlementsStatusTabs } from "./SettlementsStatusTabs";

type SettlementsTableCardProps = {
  result: SettlementsListResult;
  query: SettlementsQueryParams;
};

const SettlementsTableCard = ({ result, query }: SettlementsTableCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingTicketId, setPendingTicketId] = useState<string | null>(null);

  // Both handlers are memoised so the column factory below only re-runs when
  // the pending state actually changes, not on every render.
  const closeTicket = useCallback(
    (ticket: SettlementTicket) => {
      setPendingTicketId(ticket.id);

      startTransition(async () => {
        const outcome = await closeSettlementTicketAction(ticket.id);
        setPendingTicketId(null);

        if (!outcome.success) {
          toast.error(outcome.error ?? "Could not close this ticket.");
          return;
        }

        toast.success(`${ticket.ticketId} closed.`);
        router.refresh();
      });
    },
    [router],
  );

  const viewReceipt = useCallback((ticket: SettlementTicket) => {
    // TODO: point at the receipt document once settlement storage exists.
    toast.info(`Receipt for ${ticket.ticketId} is not available yet.`);
  }, []);

  const columns = useMemo(
    () =>
      createSettlementsColumns({
        onCloseTicket: closeTicket,
        onViewReceipt: viewReceipt,
        pendingTicketId: isPending ? pendingTicketId : null,
      }),
    [closeTicket, viewReceipt, isPending, pendingTicketId],
  );

  const isFiltered = Boolean(query.search) || query.status !== ALL_SETTLEMENTS;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Card Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Settlement Tickets</h2>

        <SettlementsExportButton query={query} />
      </div>

      {/* ─── Status Filter Tabs (server-side `status` param) ─── */}
      <SettlementsStatusTabs activeTab={query.status} />

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load settlement tickets
          </p>
          <p className="mt-1 text-sm text-slate-500">{result.error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <DataTable
          data={result.data}
          columns={columns}
          enableSelection={false}
          showSequence={false}
          isDropDownFilter={false}
          emptyMessage={
            isFiltered
              ? "No tickets match this filter."
              : "No settlement tickets yet."
          }
        />
      )}

      {/* ─── Footer count ─── */}
      {!result.error && (
        <div className="border-t border-slate-100 px-6 py-3.5 text-xs font-medium text-slate-400">
          {result.totalItems} {result.totalItems === 1 ? "ticket" : "tickets"}{" "}
          shown
        </div>
      )}
    </div>
  );
};

export default SettlementsTableCard;
export { SettlementsTableCard };
export type { SettlementsTableCardProps };
