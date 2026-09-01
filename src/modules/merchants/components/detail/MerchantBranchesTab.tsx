import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/formatters";
import { fetchMerchantBranches } from "../../services/merchantDetailService";
import type { MerchantDetail } from "../../types";

type MerchantBranchesTabProps = {
  merchant: MerchantDetail;
};

/** FE-158 — the merchant's branch network with its activity at a glance. */
const MerchantBranchesTab = async ({ merchant }: MerchantBranchesTabProps) => {
  const branches = await fetchMerchantBranches(merchant);

  if (branches.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-20 text-center shadow-xs">
        <Store className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">
          No branches yet
        </p>
        {/* FE-108 — a merchant without an eligible branch stays hidden from
            customers, so this is an action item, not just an empty list. */}
        <p className="mt-1 text-sm text-slate-500">
          This merchant stays hidden from customers until it has at least one
          active branch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Store className="size-4.5" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {branch.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {branch.city} · <span className="font-mono">{branch.code}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-slate-400">Transactions</p>
              <p className="font-mono text-sm font-bold text-slate-900">
                {formatAmount(branch.transactions)}
              </p>
            </div>

            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                branch.isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  branch.isActive ? "bg-emerald-500" : "bg-slate-400",
                )}
              />
              {branch.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MerchantBranchesTab;
export { MerchantBranchesTab };
export type { MerchantBranchesTabProps };
