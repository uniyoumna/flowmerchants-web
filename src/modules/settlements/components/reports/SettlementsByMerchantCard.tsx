import { formatCurrency } from "@/utils/formatters";
import type { MerchantNetSettlement } from "../../types";

type SettlementsByMerchantCardProps = {
  merchants: MerchantNetSettlement[];
  currency: string;
};

/**
 * Net settlement per merchant, biggest payout first.
 *
 * Each bar is scaled against the largest payout rather than the total, so the
 * top merchant fills the row and the rest read as a share of it — that makes
 * the relative sizes legible even when one merchant dominates the book.
 */
const SettlementsByMerchantCard = ({
  merchants,
  currency,
}: SettlementsByMerchantCardProps) => {
  // Guard the divide: every merchant settling zero must not produce NaN widths.
  const largestNet = Math.max(...merchants.map((m) => m.net), 0) || 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Net Settlement by Merchant
        </h2>
        <p className="mt-0.5 text-sm text-slate-400">All periods combined</p>
      </div>

      {merchants.length === 0 ? (
        <div className="border-t border-slate-100 px-6 py-14 text-center text-sm text-slate-500">
          No settlement activity in this period.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {merchants.map((merchant) => (
            <div key={merchant.merchantId} className="px-6 py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-bold text-slate-900">
                    {merchant.merchantName}
                  </span>
                  <span className="font-mono text-xs text-slate-300">
                    {merchant.merchantCode}
                  </span>
                </div>

                <span className="font-mono text-sm font-bold whitespace-nowrap text-slate-900">
                  {formatCurrency(merchant.net, currency)}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#4C1D95] to-[#A855F7]"
                  style={{ width: `${(merchant.net / largestNet) * 100}%` }}
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-500">
                  Gross: {formatCurrency(merchant.gross, currency)}
                </span>

                {/* Parenthesised and red: refunds are money leaving the book. */}
                <span className="text-rose-500">
                  Refunds: ({formatCurrency(merchant.refunds, currency)})
                </span>

                <span className="text-slate-500">
                  {merchant.ticketCount}{" "}
                  {merchant.ticketCount === 1 ? "ticket" : "tickets"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettlementsByMerchantCard;
export { SettlementsByMerchantCard };
export type { SettlementsByMerchantCardProps };
