import { cn } from "@/lib/utils";
import {
  SETTLEMENT_STATUS_LABELS,
  SETTLEMENT_STATUS_STYLES,
} from "../../constants";
import type { SettlementStatus } from "../../types";

type SettlementStatusBadgeProps = {
  status: SettlementStatus;
  className?: string;
};

const SettlementStatusBadge = ({
  status,
  className,
}: SettlementStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        SETTLEMENT_STATUS_STYLES[status],
        className,
      )}
    >
      {SETTLEMENT_STATUS_LABELS[status]}
    </span>
  );
};

export default SettlementStatusBadge;
export { SettlementStatusBadge };
export type { SettlementStatusBadgeProps };
