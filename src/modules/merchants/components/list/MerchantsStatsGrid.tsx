import { Activity, AlertTriangle, Clock, FileText } from "lucide-react";
import { MetricCard } from "@/components/base/MetricCard";
import type { MerchantsOverview } from "../../types";

type MerchantsStatsGridProps = {
  overview?: MerchantsOverview;
  isLoading?: boolean;
};

const MerchantsStatsGrid = ({
  overview,
  isLoading = false,
}: MerchantsStatsGridProps) => {
  const format = (value: number) =>
    isLoading || !overview ? "—" : value.toLocaleString();

  const cards = [
    {
      title: "Total Merchants",
      value: format(overview?.total ?? 0),
      icon: <FileText className="size-5 text-purple-600" />,
      iconBg: "bg-purple-100 text-purple-600",
    },
    {
      title: "Active",
      value: format(overview?.active ?? 0),
      icon: <Activity className="size-5 text-emerald-600" />,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Pending Action",
      value: format(overview?.pending ?? 0),
      icon: <Clock className="size-5 text-amber-600" />,
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      title: "At Risk / Blocked",
      value: format(overview?.atRisk ?? 0),
      icon: <AlertTriangle className="size-5 text-blue-600" />,
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

export default MerchantsStatsGrid;
export { MerchantsStatsGrid };
export type { MerchantsStatsGridProps };
