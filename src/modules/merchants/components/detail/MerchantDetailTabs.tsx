import Link from "next/link";
import { cn } from "@/lib/utils";
import { MERCHANT_DETAIL_TAB_LABELS } from "../../constants";
import {
  MERCHANT_DETAIL_TABS,
  type MerchantDetailCounts,
  type MerchantDetailTab,
} from "../../types";
import { buildMerchantDetailHref } from "../../utils/merchantDetailQuery";

type MerchantDetailTabsProps = {
  merchantId: string;
  activeTab: MerchantDetailTab;
  /** Badge numbers; a zero count renders no badge. */
  counts: MerchantDetailCounts;
};

const MerchantDetailTabs = ({
  merchantId,
  activeTab,
  counts,
}: MerchantDetailTabsProps) => {
  const countFor: Record<MerchantDetailTab, number> = {
    overview: 0,
    financials: counts.financials,
    risk: counts.risk,
    branches: counts.branches,
  };

  return (
    <nav
      aria-label="Merchant sections"
      className="flex gap-6 overflow-x-auto border-t border-slate-100 px-6 lg:px-8"
    >
      {MERCHANT_DETAIL_TABS.map((tab) => {
        const isActive = tab === activeTab;
        const count = countFor[tab];

        return (
          <Link
            key={tab}
            href={buildMerchantDetailHref(merchantId, tab)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-[#7C3AED] text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {MERCHANT_DETAIL_TAB_LABELS[tab]}

            {count > 0 && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default MerchantDetailTabs;
export { MerchantDetailTabs };
export type { MerchantDetailTabsProps };
