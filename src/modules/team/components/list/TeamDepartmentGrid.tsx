import { cn } from "@/lib/utils";
import {
  TEAM_DEPARTMENT_ACCENTS,
  TEAM_DEPARTMENT_LABELS,
} from "../../constants";
import type { DepartmentSummary } from "../../types";

type TeamDepartmentGridProps = {
  departments?: DepartmentSummary[];
  isLoading?: boolean;
};

/**
 * Active headcount per department.
 *
 * Counts active members only, so a department whose only officer is suspended
 * reads zero — that is the number a lead needs when deciding where to hire.
 */
const TeamDepartmentGrid = ({
  departments,
  isLoading = false,
}: TeamDepartmentGridProps) => {
  const rows =
    departments ??
    (
      Object.keys(
        TEAM_DEPARTMENT_LABELS,
      ) as (keyof typeof TEAM_DEPARTMENT_LABELS)[]
    ).map((department) => ({ department, activeMembers: 0 }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((row) => (
        <div
          key={row.department}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs"
        >
          <p
            className={cn(
              "text-xs font-semibold tracking-wider uppercase",
              TEAM_DEPARTMENT_ACCENTS[row.department],
            )}
          >
            {TEAM_DEPARTMENT_LABELS[row.department]}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {isLoading ? "—" : row.activeMembers}
          </p>

          <p className="mt-1 text-xs text-slate-400">active members</p>
        </div>
      ))}
    </div>
  );
};

export default TeamDepartmentGrid;
export { TeamDepartmentGrid };
export type { TeamDepartmentGridProps };
