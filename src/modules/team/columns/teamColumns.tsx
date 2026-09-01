import type { ColumnDef } from "@/components/table";
import { cn } from "@/lib/utils";
import { TeamMemberCell } from "../components/shared/TeamMemberCell";
import { TeamStatusBadge } from "../components/shared/TeamStatusBadge";
import {
  TEAM_DEPARTMENT_LABELS,
  TEAM_DEPARTMENT_STYLES,
  TEAM_ROLE_LABELS,
} from "../constants";
import type { TeamMember } from "../types";

type CreateTeamColumnsOptions = {
  onSuspend?: (member: TeamMember) => void;
  onReactivate?: (member: TeamMember) => void;
  onResend?: (member: TeamMember) => void;
  /** Member currently being acted on — its button shows the pending state. */
  pendingMemberId?: string | null;
};

export function createTeamColumns({
  onSuspend,
  onReactivate,
  onResend,
  pendingMemberId,
}: CreateTeamColumnsOptions = {}): ColumnDef<TeamMember, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => <TeamMemberCell member={row.original} />,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {TEAM_ROLE_LABELS[row.original.role]}
        </span>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
            TEAM_DEPARTMENT_STYLES[row.original.department],
          )}
        >
          {TEAM_DEPARTMENT_LABELS[row.original.department]}
        </span>
      ),
    },
    {
      accessorKey: "merchantCount",
      header: "Merchants",
      cell: ({ row }) => {
        // An invitee holds no assignments yet, which is not the same as zero.
        if (row.original.merchantCount === null) {
          return <span className="text-sm text-slate-300">—</span>;
        }

        return (
          <span className="text-sm font-bold text-slate-900">
            {row.original.merchantCount}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TeamStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-400">
          {row.original.joinedAt}
        </span>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="font-mono text-xs whitespace-nowrap text-slate-400">
          {row.original.lastActiveAt}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        const isPending = pendingMemberId === member.id;

        // What you can do depends on where the member is: an accepted account
        // can be suspended or restored; an unaccepted invite can only be resent.
        if (member.status === "invite_pending") {
          return (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onResend?.(member)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-[#7C3AED]/30 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Resend
            </button>
          );
        }

        if (member.status === "suspended") {
          return (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onReactivate?.(member)}
              className="inline-flex cursor-pointer items-center rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reactivate
            </button>
          );
        }

        return (
          <button
            type="button"
            disabled={isPending}
            onClick={() => onSuspend?.(member)}
            className="inline-flex cursor-pointer items-center rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-amber-600 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suspend
          </button>
        );
      },
    },
  ];
}
