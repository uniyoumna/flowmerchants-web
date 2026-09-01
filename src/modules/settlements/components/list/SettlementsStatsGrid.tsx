import { SummaryCard } from "@/components/base/SummaryCard";
import { formatCurrency } from "@/utils/formatters";
import type { SettlementsOverview } from "../../types";

type SettlementsStatsGridProps = {
  overview?: SettlementsOverview;
  isLoading?: boolean;
};

const SettlementsStatsGrid = ({
  overview,
  isLoading = false,
}: SettlementsStatsGridProps) => {
  const money = (value: number) =>
    isLoading || !overview ? "—" : formatCurrency(value, overview.currency);

  const count = (value: number) =>
    isLoading || !overview ? "—" : value.toLocaleString();

  const cards = [
    {
      label: "Due for Payment",
      value: money(overview?.dueForPayment ?? 0),
      description: "Due + Overdue tickets",
      variant: "warning" as const,
    },
    {
      label: "Processing",
      value: money(overview?.processing ?? 0),
      description: "Transfer in progress",
      variant: "purple" as const,
    },
    {
      label: "Overdue Tickets",
      value: count(overview?.overdueTickets ?? 0),
      description: "Requires immediate action",
      variant: "danger" as const,
    },
    {
      label: "Upcoming (7d)",
      value: count(overview?.upcomingCount ?? 0),
      description: "Next settlement events",
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

export default SettlementsStatsGrid;
export { SettlementsStatsGrid };
export type { SettlementsStatsGridProps };
