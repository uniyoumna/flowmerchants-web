"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { RISK_FLAG_TAB_LABELS } from "../../constants";
import { RISK_FLAG_TABS, type RiskFlagTab } from "../../types";
import { buildRiskFlagsTabHref } from "../../utils/riskFlagsQuery";

type RiskFlagsStatusTabsProps = {
  activeTab: RiskFlagTab;
};

/**
 * The status filter.
 *
 * Each tab is a real link that writes `?status=` to the URL and the server
 * refetches that slice, so the other statuses' rows are never sent to the
 * browser. That also makes "everything still open" a shareable link and keeps
 * browser back working between tabs.
 */
const RiskFlagsStatusTabs = ({ activeTab }: RiskFlagsStatusTabsProps) => {
  const searchParams = useSearchParams();

  return (
    <nav
      aria-label="Filter cases by status"
      className="flex gap-6 overflow-x-auto border-b border-slate-100 px-6"
    >
      {RISK_FLAG_TABS.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <Link
            key={tab}
            href={buildRiskFlagsTabHref(tab, searchParams)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 py-3.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {RISK_FLAG_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </nav>
  );
};

export default RiskFlagsStatusTabs;
export { RiskFlagsStatusTabs };
export type { RiskFlagsStatusTabsProps };
