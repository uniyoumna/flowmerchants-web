import { cn } from "@/lib/utils";
import { TEAM_STATUS_LABELS, TEAM_STATUS_STYLES } from "../../constants";
import type { TeamMemberStatus } from "../../types";

type TeamStatusBadgeProps = {
  status: TeamMemberStatus;
  className?: string;
};

const TeamStatusBadge = ({ status, className }: TeamStatusBadgeProps) => {
  const style = TEAM_STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        style.surface,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {TEAM_STATUS_LABELS[status]}
    </span>
  );
};

export default TeamStatusBadge;
export { TeamStatusBadge };
export type { TeamStatusBadgeProps };
