import { cn } from "@/lib/utils";
import type { TeamMember } from "../../types";

type TeamMemberCellProps = {
  member: TeamMember;
};

/** Avatar, name and email — the identity column of the members table. */
const TeamMemberCell = ({ member }: TeamMemberCellProps) => {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
          member.avatarTone,
        )}
      >
        {member.initials}
      </span>

      <div className="min-w-0">
        <p className="truncate font-bold text-slate-900">{member.name}</p>
        <p className="truncate text-xs font-normal text-slate-400">
          {member.email}
        </p>
      </div>
    </div>
  );
};

export default TeamMemberCell;
export { TeamMemberCell };
export type { TeamMemberCellProps };
