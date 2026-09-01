import { cn } from "@/lib/utils";
import { formatAmount, formatCurrency } from "@/utils/formatters";
import type { MerchantDetail } from "../../types";

type MerchantDetailKpisProps = {
  merchant: MerchantDetail;
};

type Kpi = {
  label: string;
  value: string;
  className?: string;
};

/**
 * FE-134 — every KPI shows a value (zero included) and names its currency, so a
 * quiet merchant reads as "nothing yet" rather than "failed to load".
 */
const MerchantDetailKpis = ({ merchant }: MerchantDetailKpisProps) => {
  const kpis: Kpi[] = [
    {
      label: "Wallet Balance",
      value: formatCurrency(merchant.walletBalance, merchant.currency),
    },
    {
      label: "Pending Settlement",
      value: formatCurrency(merchant.pendingSettlement, merchant.currency),
      className: "text-amber-500",
    },
    {
      label: "Total Purchases",
      value: formatAmount(merchant.totalPurchases),
    },
  ];

  return (
    <div className="grid gap-4 border-t border-slate-100 px-6 py-5 sm:grid-cols-3 lg:px-8">
      {kpis.map((kpi) => (
        <div key={kpi.label}>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {kpi.label}
          </p>
          <p
            className={cn(
              "mt-1 font-mono text-2xl font-bold tracking-tight text-slate-900",
              kpi.className,
            )}
          >
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MerchantDetailKpis;
export { MerchantDetailKpis };
export type { MerchantDetailKpisProps };
