import { cn } from "@/lib/utils";
import { CONFIG_STATUS_LABELS, CONFIG_STATUS_STYLES } from "../../constants";
import type { ConfigStatus } from "../../types";

type ConfigStatusBadgeProps = {
  status: ConfigStatus;
  className?: string;
};

const ConfigStatusBadge = ({ status, className }: ConfigStatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        CONFIG_STATUS_STYLES[status],
        className,
      )}
    >
      {CONFIG_STATUS_LABELS[status]}
    </span>
  );
};

export default ConfigStatusBadge;
export { ConfigStatusBadge };
export type { ConfigStatusBadgeProps };
