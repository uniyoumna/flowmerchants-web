import { cn } from "@/lib/utils";
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_STYLES,
} from "../../constants";
import type { TransactionType } from "../../types";

type TransactionTypeBadgeProps = {
  type: TransactionType;
  className?: string;
};

/** Purchase reads purple, refund red — money in versus money going back. */
const TransactionTypeBadge = ({
  type,
  className,
}: TransactionTypeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        TRANSACTION_TYPE_STYLES[type],
        className,
      )}
    >
      {TRANSACTION_TYPE_LABELS[type]}
    </span>
  );
};

export default TransactionTypeBadge;
export { TransactionTypeBadge };
export type { TransactionTypeBadgeProps };
