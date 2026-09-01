import { cn } from "@/lib/utils";
import {
  RISK_FLAG_STATUS_LABELS,
  RISK_FLAG_STATUS_STYLES,
} from "../../constants";
import type { RiskFlagStatus } from "../../types";

type RiskFlagStatusBadgeProps = {
  status: RiskFlagStatus;
  className?: string;
};

const RiskFlagStatusBadge = ({
  status,
  className,
}: RiskFlagStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold",
        RISK_FLAG_STATUS_STYLES[status],
        className,
      )}
    >
      {RISK_FLAG_STATUS_LABELS[status]}
    </span>
  );
};

export default RiskFlagStatusBadge;
export { RiskFlagStatusBadge };
export type { RiskFlagStatusBadgeProps };
