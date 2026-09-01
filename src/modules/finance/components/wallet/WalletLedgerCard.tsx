import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/formatters";
import {
  WALLET_DEFAULT_BALANCE_NOTE,
  WALLET_ENTRY_TYPE_LABELS,
  WALLET_ENTRY_TYPE_STYLES,
} from "../../constants";
import type { WalletLedgerEntry } from "../../types";

type WalletLedgerCardProps = {
  ledger: WalletLedgerEntry[];
  currency: string;
};

const HeaderCell = ({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) => (
  <th
    className={cn(
      "px-6 py-3.5 text-xs font-medium tracking-wide text-slate-400 uppercase",
      align === "right" ? "text-right" : "text-left",
    )}
  >
    {children}
  </th>
);

/** Recent movements in and out of the wallet, newest first. */
const WalletLedgerCard = ({ ledger, currency }: WalletLedgerCardProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Wallet Ledger</h2>
        <p className="mt-0.5 text-sm text-slate-400">Recent wallet movements</p>
      </div>

      {ledger.length === 0 ? (
        <div className="border-t border-slate-100 px-6 py-14 text-center text-sm text-slate-500">
          No wallet movements yet.
        </div>
      ) : (
        // Wider than a phone, so the table scrolls inside its own container
        // rather than pushing the page sideways.
        <div className="overflow-x-auto border-t border-slate-100">
          <table className="w-full min-w-160 border-collapse">
            <thead className="border-b border-slate-100">
              <tr>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Date</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Type</HeaderCell>
                <HeaderCell align="right">Amount</HeaderCell>
                <HeaderCell align="right">Balance After</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {ledger.map((entry) => {
                const isIncome = entry.type === "income";

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {entry.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-slate-500">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                          WALLET_ENTRY_TYPE_STYLES[entry.type],
                        )}
                      >
                        {isIncome ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )}
                        {WALLET_ENTRY_TYPE_LABELS[entry.type]}
                      </span>
                    </td>
                    {/* The sign is carried by the entry type, so it is rendered
                        here rather than stored on the amount. */}
                    <td
                      className={cn(
                        "px-6 py-4 text-right font-mono text-sm font-bold whitespace-nowrap",
                        isIncome ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {isIncome ? "+" : "-"}
                      {currency} {formatAmount(entry.amount)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-bold whitespace-nowrap text-slate-900">
                      {currency} {formatAmount(entry.balanceAfter)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-6 py-3.5">
        <span className="text-xs font-medium text-slate-400">
          {ledger.length} {ledger.length === 1 ? "entry" : "entries"} shown
        </span>

        <span className="font-mono text-xs text-slate-300">
          {WALLET_DEFAULT_BALANCE_NOTE}
        </span>
      </div>
    </section>
  );
};

export default WalletLedgerCard;
export { WalletLedgerCard };
export type { WalletLedgerCardProps };
