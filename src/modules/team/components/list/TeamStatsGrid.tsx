import { SummaryCard } from "@/components/base/SummaryCard";
import type { TeamOverview } from "../../types";

type TeamStatsGridProps = {
  overview?: TeamOverview;
  isLoading?: boolean;
};

const TeamStatsGrid = ({ overview, isLoading = false }: TeamStatsGridProps) => {
  const count = (value: number) =>
    isLoading || !overview ? "—" : value.toLocaleString();

  const cards = [
    {
      label: "Total Members",
      value: count(overview?.totalMembers ?? 0),
      description: "All departments",
      variant: "default" as const,
    },
    {
      label: "Active",
      value: count(overview?.active ?? 0),
      description: "Fully onboarded",
      variant: "success" as const,
    },
    {
      label: "Pending Invites",
      value: count(overview?.pendingInvites ?? 0),
      description: "Awaiting acceptance",
      variant: "warning" as const,
    },
    {
      label: "Merchants Covered",
      value: count(overview?.merchantsCovered ?? 0),
      description: "Total assignments",
      variant: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard
          key={card.label}
          label={card.label}
          value={card.value}
          description={card.description}
          variant={card.variant}
        />
      ))}
    </div>
  );
};

export default TeamStatsGrid;
export { TeamStatsGrid };
export type { TeamStatsGridProps };
