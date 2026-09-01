import { AlertCircle, Clock, FileCheck2, Hourglass } from "lucide-react";
import { MetricCard } from "@/components/base/MetricCard";
import type { ConfigOverview } from "../../types";

type ConfigStatsGridProps = {
  overview?: ConfigOverview;
  isLoading?: boolean;
};

const ConfigStatsGrid = ({
  overview,
  isLoading = false,
}: ConfigStatsGridProps) => {
  const format = (value: number) =>
    isLoading || !overview ? "—" : value.toLocaleString();

  const cards = [
    {
      title: "Under Review",
      value: format(overview?.underReview ?? 0),
      icon: <FileCheck2 className="size-5 text-emerald-600" />,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "SLA Overdue",
      value: format(overview?.slaOverdue ?? 0),
      icon: <Clock className="size-5 text-emerald-600" />,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Pending Review",
      value: format(overview?.pendingReview ?? 0),
      icon: <Hourglass className="size-5 text-amber-600" />,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "Expiry Risk",
      value: format(overview?.expiryRisk ?? 0),
      icon: <AlertCircle className="size-5 text-blue-600" />,
      iconBg: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
        />
      ))}
    </div>
  );
};

export default ConfigStatsGrid;
export { ConfigStatsGrid };
export type { ConfigStatsGridProps };
