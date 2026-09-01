"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/table";
import {
  blockRiskFlagMerchantAction,
  resolveRiskFlagCaseAction,
} from "../../actions/riskFlagsActions";
import { createRiskFlagsColumns } from "../../columns/riskFlagsColumns";
import {
  ALL_RISK_FLAGS,
  type RiskFlagCase,
  type RiskFlagsListResult,
  type RiskFlagsQueryParams,
} from "../../types";
import { RiskFlagsStatusTabs } from "./RiskFlagsStatusTabs";

type RiskFlagsTableCardProps = {
  result: RiskFlagsListResult;
  query: RiskFlagsQueryParams;
};

const RiskFlagsTableCard = ({ result, query }: RiskFlagsTableCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingCaseId, setPendingCaseId] = useState<string | null>(null);

  // Both handlers are memoised so the column factory below only re-runs when
  // the pending state actually changes, not on every render.
  const block = useCallback(
    (riskCase: RiskFlagCase) => {
      setPendingCaseId(riskCase.id);

      startTransition(async () => {
        const outcome = await blockRiskFlagMerchantAction(riskCase.id);
        setPendingCaseId(null);

        if (!outcome.success) {
          toast.error(outcome.error ?? "Could not block this merchant.");
          return;
        }

        toast.success(`${riskCase.merchantName} blocked.`);
        router.refresh();
      });
    },
    [router],
  );

  const resolve = useCallback(
    (riskCase: RiskFlagCase) => {
      setPendingCaseId(riskCase.id);

      startTransition(async () => {
        const outcome = await resolveRiskFlagCaseAction(riskCase.id);
        setPendingCaseId(null);

        if (!outcome.success) {
          toast.error(outcome.error ?? "Could not resolve this case.");
          return;
        }

        toast.success(`${riskCase.caseId} resolved.`);
        router.refresh();
      });
    },
    [router],
  );

  const columns = useMemo(
    () =>
      createRiskFlagsColumns({
        onBlock: block,
        onResolve: resolve,
        pendingCaseId: isPending ? pendingCaseId : null,
      }),
    [block, resolve, isPending, pendingCaseId],
  );

  const isFiltered = Boolean(query.search) || query.status !== ALL_RISK_FLAGS;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Card Header ─── */}
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">Risk Flag Cases</h2>
      </div>

      {/* ─── Status Filter Tabs (server-side `status` param) ─── */}
      <RiskFlagsStatusTabs activeTab={query.status} />

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load risk flag cases
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
              ? "No cases match this filter."
              : "No risk flags raised yet."
          }
        />
      )}

      {/* ─── Footer count ─── */}
      {!result.error && (
        <div className="border-t border-slate-100 px-6 py-3.5 text-xs font-medium text-slate-400">
          {result.totalItems} {result.totalItems === 1 ? "case" : "cases"} shown
        </div>
      )}
    </div>
  );
};

export default RiskFlagsTableCard;
export { RiskFlagsTableCard };
export type { RiskFlagsTableCardProps };
