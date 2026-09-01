import { SummaryCard } from "@/components/base/SummaryCard";
import type { RiskFlagsOverview } from "../../types";

type RiskFlagsStatsGridProps = {
  overview?: RiskFlagsOverview;
  isLoading?: boolean;
};

const RiskFlagsStatsGrid = ({
  overview,
  isLoading = false,
}: RiskFlagsStatsGridProps) => {
  const count = (value: number) =>
    isLoading || !overview ? "—" : value.toLocaleString();

  const cards = [
    {
      label: "Open Flags",
      value: count(overview?.openFlags ?? 0),
      description: "Awaiting review",
      variant: "danger" as const,
    },
    {
      label: "Under Review",
      value: count(overview?.underReview ?? 0),
      description: "Assigned to officer",
      variant: "warning" as const,
    },
    {
      label: "High Severity",
      value: count(overview?.highSeverity ?? 0),
      // Counted across every status: a resolved high-severity case still
      // happened, and hiding it would understate the merchant's history.
      description: "All statuses",
      variant: "danger" as const,
    },
    {
      label: "Blocked Merchants",
      value: count(overview?.blockedMerchants ?? 0),
      description: "Purchase suspended",
      variant: "default" as const,
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

export default RiskFlagsStatsGrid;
export { RiskFlagsStatsGrid };
export type { RiskFlagsStatsGridProps };
