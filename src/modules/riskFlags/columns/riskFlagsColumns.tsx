import type { ColumnDef } from "@/components/table";
import { cn } from "@/lib/utils";
import { RiskFlagSeverityBadge } from "../components/shared/RiskFlagSeverityBadge";
import { RiskFlagStatusBadge } from "../components/shared/RiskFlagStatusBadge";
import {
  ACTIONABLE_STATUSES,
  RISK_FLAG_TYPE_LABELS,
  RISK_FLAG_TYPE_STYLES,
} from "../constants";
import type { RiskFlagCase } from "../types";

type CreateRiskFlagsColumnsOptions = {
  /** Suspends purchases for the merchant behind the case. */
  onBlock?: (riskCase: RiskFlagCase) => void;
  /** Closes the case as handled. */
  onResolve?: (riskCase: RiskFlagCase) => void;
  /** Case currently being acted on — its buttons show the pending state. */
  pendingCaseId?: string | null;
};

export function createRiskFlagsColumns({
  onBlock,
  onResolve,
  pendingCaseId,
}: CreateRiskFlagsColumnsOptions = {}): ColumnDef<RiskFlagCase, unknown>[] {
  return [
    {
      accessorKey: "caseId",
      header: "Case ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-600">
          {row.original.caseId}
        </span>
      ),
    },
    {
      accessorKey: "merchantName",
      header: "Entity",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-900">
            {row.original.merchantName}
          </span>

          {/* Blank when the rule tripped across the merchant, not one branch. */}
          {row.original.branchName && (
            <span className="text-xs font-normal text-slate-400">
              {row.original.branchName}
            </span>
          )}

          <span className="font-mono text-xs font-normal text-slate-300">
            {row.original.merchantCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className={cn(
            "text-sm font-semibold",
            RISK_FLAG_TYPE_STYLES[row.original.type],
          )}
        >
          {RISK_FLAG_TYPE_LABELS[row.original.type]}
        </span>
      ),
    },
    {
      accessorKey: "metric",
      header: "Metric",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-700">
          {row.original.metric}
        </span>
      ),
    },
    {
      accessorKey: "observed",
      header: "Observed",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-bold whitespace-nowrap text-slate-900">
          {row.original.observed}
        </span>
      ),
    },
    {
      accessorKey: "threshold",
      header: "Threshold",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-500">
          {row.original.threshold}
        </span>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <RiskFlagSeverityBadge severity={row.original.severity} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <RiskFlagStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "detectedAt",
      header: "Detected",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-400">
          {row.original.detectedAt}
        </span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        if (!row.original.assignedTo) {
          return <span className="text-sm text-slate-400">Unassigned</span>;
        }

        return (
          <span className="text-sm text-slate-700">
            {row.original.assignedTo}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const riskCase = row.original;

        // A resolved or dismissed case is closed — nothing left to act on.
        if (!ACTIONABLE_STATUSES.includes(riskCase.status)) return null;

        const isPending = pendingCaseId === riskCase.id;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => onBlock?.(riskCase)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Block
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => onResolve?.(riskCase)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resolve
            </button>
          </div>
        );
      },
    },
  ];
}
