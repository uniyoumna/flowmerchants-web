import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import {
  SETTLEMENT_STATUS_LABELS,
  SETTLEMENT_STATUS_TILE_STYLES,
} from "../../constants";
import type { SettlementStatusSummary } from "../../types";

type SettlementsStatusBreakdownCardProps = {
  statuses: SettlementStatusSummary[];
  currency: string;
};

/** How many tickets sit in each state, and how much money is behind them. */
const SettlementsStatusBreakdownCard = ({
  statuses,
  currency,
}: SettlementsStatusBreakdownCardProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Settlement Status Breakdown
        </h2>
      </div>

      {statuses.length === 0 ? (
        <div className="border-t border-slate-100 px-6 py-14 text-center text-sm text-slate-500">
          No settlement tickets to break down yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          {statuses.map((entry) => {
            const tile = SETTLEMENT_STATUS_TILE_STYLES[entry.status];

            return (
              <div
                key={entry.status}
                className={cn("rounded-xl p-5", tile.surface)}
              >
                <p
                  className={cn(
                    "text-xs font-semibold tracking-wider uppercase",
                    tile.text,
                  )}
                >
                  {SETTLEMENT_STATUS_LABELS[entry.status]}
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {entry.count}
                </p>

                {/* An upcoming batch has a count but no money yet, so the
                    amount line is omitted rather than shown as zero. */}
                {entry.amount !== null && (
                  <p className={cn("mt-1 font-mono text-sm", tile.text)}>
                    {formatCurrency(entry.amount, currency)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SettlementsStatusBreakdownCard;
export { SettlementsStatusBreakdownCard };
export type { SettlementsStatusBreakdownCardProps };
