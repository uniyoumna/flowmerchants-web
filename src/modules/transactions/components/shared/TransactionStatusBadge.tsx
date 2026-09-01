import { cn } from "@/lib/utils";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_STYLES,
} from "../../constants";
import type { TransactionStatus } from "../../types";

type TransactionStatusBadgeProps = {
  status: TransactionStatus;
  className?: string;
};

const TransactionStatusBadge = ({
  status,
  className,
}: TransactionStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        TRANSACTION_STATUS_STYLES[status],
        className,
      )}
    >
      {TRANSACTION_STATUS_LABELS[status]}
    </span>
  );
};

export default TransactionStatusBadge;
export { TransactionStatusBadge };
export type { TransactionStatusBadgeProps };
