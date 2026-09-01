import { cn } from "@/lib/utils";

type ConfigSlaBarProps = {
  /** Share of the review window already spent, 0–100. */
  percent: number;
  className?: string;
};

/** Amber from 75% of the window spent, rose once the SLA is blown. */
const WARNING_THRESHOLD = 75;
const BREACH_THRESHOLD = 100;

/**
 * How much of the review window is gone. Colour carries the urgency so the
 * queue can be triaged by scanning the column rather than reading every number.
 */
const ConfigSlaBar = ({ percent, className }: ConfigSlaBarProps) => {
  const clamped = Math.min(100, Math.max(0, percent));

  const tone =
    percent >= BREACH_THRESHOLD
      ? "bg-rose-500"
      : percent >= WARNING_THRESHOLD
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

export default ConfigSlaBar;
export { ConfigSlaBar };
export type { ConfigSlaBarProps };
