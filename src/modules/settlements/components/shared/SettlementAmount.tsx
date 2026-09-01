import { cn } from "@/lib/utils";
import { formatAmount, formatDeduction } from "@/utils/formatters";

type SettlementAmountProps = {
  value: number | null;
  /** Renders as an accounting negative — `(12,100)` — and, for refunds, in red. */
  variant?: "plain" | "deduction" | "refund" | "net";
};

const DASH = "—";

/**
 * One money cell.
 *
 * Two different things print as a dash, both deliberately. `null` means the
 * figure does not exist yet — an upcoming ticket whose window has not closed.
 * A zero *deduction* prints as a dash too, following the accounting convention
 * where a dash is nil: "(0) refunds" reads like a rounding artefact, a dash
 * reads as "none".
 *
 * A zero gross or net still prints as `0`, because there the number is a real
 * result — a week with no sales — and hiding it behind a dash would make a
 * settled ticket look uncalculated.
 */
const SettlementAmount = ({
  value,
  variant = "plain",
}: SettlementAmountProps) => {
  const isDeduction = variant === "deduction" || variant === "refund";

  if (value === null || (isDeduction && value === 0)) {
    return <span className="font-mono text-sm text-slate-300">{DASH}</span>;
  }

  return (
    <span
      className={cn(
        "font-mono text-sm whitespace-nowrap",
        variant === "net" && "font-bold text-slate-900",
        variant === "plain" && "text-slate-700",
        variant === "deduction" && "text-slate-500",
        variant === "refund" && "text-rose-500",
      )}
    >
      {isDeduction ? formatDeduction(value) : formatAmount(value)}
    </span>
  );
};

export default SettlementAmount;
export { SettlementAmount };
export type { SettlementAmountProps };
