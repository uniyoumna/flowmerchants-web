import { cn } from "@/lib/utils";

type SummaryCardVariant =
  | "default"
  | "success"
  | "danger"
  | "warning"
  | "purple";

type SummaryCardProps = {
  label: string;
  value: string | number;
  description?: string;
  variant?: SummaryCardVariant;
  className?: string;
};

const VARIANT_COLORS: Record<SummaryCardVariant, string> = {
  default: "text-slate-900",
  success: "text-emerald-600",
  danger: "text-rose-600",
  warning: "text-amber-500",
  purple: "text-[#7C3AED]",
};

const SummaryCard = ({
  label,
  value,
  description,
  variant = "default",
  className,
}: SummaryCardProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm",
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold tracking-tight",
          VARIANT_COLORS[variant],
        )}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
};

export default SummaryCard;
export { SummaryCard };
export type { SummaryCardProps, SummaryCardVariant };
