"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SETTLEMENT_TAB_LABELS } from "../../constants";
import { SETTLEMENT_TABS, type SettlementTab } from "../../types";
import { buildSettlementsTabHref } from "../../utils/settlementsQuery";

type SettlementsStatusTabsProps = {
  activeTab: SettlementTab;
};

/**
 * The status filter.
 *
 * Each tab is a real link that writes `?status=` to the URL, and the server
 * refetches that slice — the rows for other statuses are never sent to the
 * browser. That also makes "show me everything overdue" a shareable link and
 * keeps browser back working between tabs.
 */
const SettlementsStatusTabs = ({ activeTab }: SettlementsStatusTabsProps) => {
  const searchParams = useSearchParams();

  return (
    <nav
      aria-label="Filter tickets by status"
      className="flex gap-6 overflow-x-auto border-b border-slate-100 px-6"
    >
      {SETTLEMENT_TABS.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <Link
            key={tab}
            href={buildSettlementsTabHref(tab, searchParams)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 border-b-2 py-3.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-[#7C3AED] text-[#7C3AED]"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {SETTLEMENT_TAB_LABELS[tab]}
          </Link>
        );
      })}
    </nav>
  );
};

export default SettlementsStatusTabs;
export { SettlementsStatusTabs };
export type { SettlementsStatusTabsProps };
