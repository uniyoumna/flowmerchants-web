import { cn } from "@/lib/utils";
import {
  RISK_FLAG_SEVERITY_LABELS,
  RISK_FLAG_SEVERITY_STYLES,
} from "../../constants";
import type { RiskFlagSeverity } from "../../types";

type RiskFlagSeverityBadgeProps = {
  severity: RiskFlagSeverity;
  className?: string;
};

const RiskFlagSeverityBadge = ({
  severity,
  className,
}: RiskFlagSeverityBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        RISK_FLAG_SEVERITY_STYLES[severity],
        className,
      )}
    >
      {RISK_FLAG_SEVERITY_LABELS[severity]}
    </span>
  );
};

export default RiskFlagSeverityBadge;
export { RiskFlagSeverityBadge };
export type { RiskFlagSeverityBadgeProps };
