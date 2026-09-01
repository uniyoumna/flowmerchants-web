import { SummaryCard } from "@/components/base/SummaryCard";
import { cn } from "@/lib/utils";
import {
  formatAmount,
  formatCurrency,
  formatDeduction,
} from "@/utils/formatters";
import {
  SETTLEMENT_STATUS_LABELS,
  SETTLEMENT_STATUS_STYLES,
} from "../../constants";
import { fetchMerchantFinancials } from "../../services/merchantDetailService";
import type { MerchantDetail } from "../../types";

type MerchantFinancialsTabProps = {
  merchant: MerchantDetail;
};

/** FE-110, FE-142 — gross-to-net totals and the settlement ticket history. */
const MerchantFinancialsTab = async ({
  merchant,
}: MerchantFinancialsTabProps) => {
  const financials = await fetchMerchantFinancials(merchant.id);
  const { currency } = merchant;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Gross (all periods)"
          value={formatCurrency(financials.gross, currency)}
        />
        <SummaryCard
          label="Net Disbursed"
          value={formatCurrency(financials.netDisbursed, currency)}
          variant="success"
        />
        <SummaryCard
          label="Total Refunds"
          value={formatCurrency(financials.totalRefunds, currency)}
          variant="danger"
        />
        <SummaryCard
          label="Tickets"
          value={financials.tickets.length}
          description="Settlement records"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        <h2 className="border-b border-slate-100 px-6 py-4 text-base font-bold text-slate-900">
          Settlement History
        </h2>

        {financials.tickets.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-400">
            No settlement tickets have been generated for this merchant yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  {[
                    { label: "Ticket ID", align: "left" },
                    { label: "Period", align: "left" },
                    { label: "Gross", align: "right" },
                    { label: "Refunds", align: "right" },
                    { label: "Fees", align: "right" },
                    { label: "Net", align: "right" },
                    { label: "Due Date", align: "left" },
                    { label: "Status", align: "left" },
                  ].map((column) => (
                    <th
                      key={column.label}
                      className={cn(
                        "px-6 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {financials.tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-[#7C3AED]">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {ticket.period}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-slate-700">
                      {formatAmount(ticket.gross)}
                    </td>
                    {/* Deductions render as accounting negatives. */}
                    <td className="px-6 py-3.5 text-right font-mono text-rose-600">
                      {formatDeduction(ticket.refunds)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-slate-500">
                      {formatDeduction(ticket.fees)}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatAmount(ticket.net)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                      {ticket.dueDate}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          SETTLEMENT_STATUS_STYLES[ticket.status],
                        )}
                      >
                        {SETTLEMENT_STATUS_LABELS[ticket.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantFinancialsTab;
export { MerchantFinancialsTab };
export type { MerchantFinancialsTabProps };
