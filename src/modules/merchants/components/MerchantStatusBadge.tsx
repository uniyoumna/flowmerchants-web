import { cn } from "@/lib/utils";
import type { MerchantStatus } from "../types";

type MerchantStatusBadgeProps = {
  status: MerchantStatus;
  className?: string;
};

const STATUS_STYLES: Record<MerchantStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600 border border-emerald-100/60",
  Blocked: "bg-rose-50 text-rose-600 border border-rose-100/60",
  "Grace Period": "bg-amber-50 text-amber-700 border border-amber-100/60",
  "Pending Compliance":
    "bg-orange-50 text-orange-700 border border-orange-100/60",
  "Pending Finance": "bg-orange-50 text-orange-700 border border-orange-100/60",
  Draft: "bg-slate-100 text-slate-600 border border-slate-200/60",
  Deactivated: "bg-slate-100 text-slate-500 border border-slate-200/60",
};

const MerchantStatusBadge = ({
  status,
  className,
}: MerchantStatusBadgeProps) => {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
};

export default MerchantStatusBadge;
export { MerchantStatusBadge };
export type { MerchantStatusBadgeProps };
