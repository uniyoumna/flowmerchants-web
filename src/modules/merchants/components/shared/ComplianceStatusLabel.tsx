import { cn } from "@/lib/utils";
import {
  COMPLIANCE_STATUS_LABELS,
  COMPLIANCE_STATUS_STYLES,
} from "../../constants";
import type { ComplianceStatus } from "../../types";

type ComplianceStatusLabelProps = {
  status: ComplianceStatus;
  className?: string;
};

/**
 * Coloured text rather than a filled pill — the SLA bar is already the loud
 * element in a queue row, and two competing badges made rows hard to scan.
 */
const ComplianceStatusLabel = ({
  status,
  className,
}: ComplianceStatusLabelProps) => {
  return (
    <span
      className={cn(
        "text-xs font-semibold",
        COMPLIANCE_STATUS_STYLES[status],
        className,
      )}
    >
      {COMPLIANCE_STATUS_LABELS[status]}
    </span>
  );
};

export default ComplianceStatusLabel;
export { ComplianceStatusLabel };
export type { ComplianceStatusLabelProps };
