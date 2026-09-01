import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ColumnDef } from "@/components/table";
import { ConfigSlaBar } from "../components/shared/ConfigSlaBar";
import { ConfigStatusBadge } from "../components/shared/ConfigStatusBadge";
import { CONFIG_SUBMISSION_TYPE_LABELS } from "../constants";
import type { ConfigWorkflow } from "../types";
import { configReviewPath } from "../utils/financeQuery";

export function createConfigWorkflowsColumns(): ColumnDef<
  ConfigWorkflow,
  unknown
>[] {
  return [
    {
      accessorKey: "merchantName",
      header: "Merchant",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">
            {row.original.merchantName}
          </span>
          <span className="text-xs font-normal text-slate-400">
            {row.original.merchantCode} · {row.original.businessType}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "submissionType",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-sm whitespace-nowrap text-slate-700">
          {CONFIG_SUBMISSION_TYPE_LABELS[row.original.submissionType]}
        </span>
      ),
    },
    {
      accessorKey: "slaPercent",
      header: "SLA",
      cell: ({ row }) => <ConfigSlaBar percent={row.original.slaPercent} />,
    },
    {
      accessorKey: "submittedBy",
      header: "Submitted By",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {row.original.submittedBy}
        </span>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submit Date",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-500">
          {row.original.submittedAt}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ConfigStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        // An unclaimed workflow is the actionable one, so it is not dimmed out.
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
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-500">
          {row.original.dueDate}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link
          href={configReviewPath(row.original.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#7C3AED]/30 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
        >
          Review
          <ArrowRight className="size-3.5" />
        </Link>
      ),
    },
  ];
}
