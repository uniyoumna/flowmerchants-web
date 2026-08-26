import type React from "react";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  className?: string;
};

const MetricCard = ({
  title,
  value,
  icon,
  iconBg = "bg-purple-100 text-purple-600",
  className,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-2xl",
          iconBg,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;
export { MetricCard };
export type { MetricCardProps };
