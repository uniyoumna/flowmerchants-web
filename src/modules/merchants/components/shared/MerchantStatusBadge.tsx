import { cn } from "@/lib/utils";
import {
  MERCHANT_STATUS_LABELS,
  MERCHANT_STATUS_STYLES,
} from "../../constants";
import type { MerchantStatus } from "../../types";

type MerchantStatusBadgeProps = {
  status: MerchantStatus;
  className?: string;
};

const MerchantStatusBadge = ({
  status,
  className,
}: MerchantStatusBadgeProps) => {
  const style =
    MERCHANT_STATUS_STYLES[status] ??
    "bg-slate-100 text-slate-600 border border-slate-200/60";

  // Fall back to the raw code so an enum value added server-side still renders.
  const label = MERCHANT_STATUS_LABELS[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
};

export default MerchantStatusBadge;
export { MerchantStatusBadge };
export type { MerchantStatusBadgeProps };
