import { cn } from "@/lib/utils";
import { WALLET_STATUS_LABELS, WALLET_STATUS_STYLES } from "../../constants";
import type { WalletStatus } from "../../types";

type WalletStatusBadgeProps = {
  status: WalletStatus;
  className?: string;
};

/** Why this wallet can or cannot move money. */
const WalletStatusBadge = ({ status, className }: WalletStatusBadgeProps) => {
  const style = WALLET_STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold whitespace-nowrap",
        style.surface,
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", style.dot)} />
      {WALLET_STATUS_LABELS[status]}
    </span>
  );
};

export default WalletStatusBadge;
export { WalletStatusBadge };
export type { WalletStatusBadgeProps };
