import { cn } from "@/lib/utils";
import { SLA_BREACH_THRESHOLD, SLA_WARNING_THRESHOLD } from "../../constants";

type ComplianceSlaBarProps = {
  /** Share of the review window already spent, 0–100. */
  percent: number;
  className?: string;
};

/**
 * How much of the review window is gone. Colour carries the urgency so a
 * reviewer can triage the queue by scanning the column rather than reading
 * every number: green while there is room, amber approaching the deadline,
 * rose once the SLA is blown.
 */
const ComplianceSlaBar = ({ percent, className }: ComplianceSlaBarProps) => {
  const clamped = Math.min(100, Math.max(0, percent));

  const tone =
    percent >= SLA_BREACH_THRESHOLD
      ? "bg-rose-500"
      : percent >= SLA_WARNING_THRESHOLD
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="SLA elapsed"
        className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className={cn("h-full rounded-full", tone)}
          style={{ width: `${clamped}%` }}
        />
      </div>

      <span className="font-mono text-xs text-slate-400">{clamped}%</span>
    </div>
  );
};

export default ComplianceSlaBar;
export { ComplianceSlaBar };
export type { ComplianceSlaBarProps };
