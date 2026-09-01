import type React from "react";
import { cn } from "@/lib/utils";

type ComplianceReviewFieldProps = {
  label: string;
  /** Renders the placeholder when the merchant left the field blank. */
  value?: string;
  /** Arabic values need RTL so the text reads correctly beside its label. */
  dir?: "rtl";
  mono?: boolean;
  children?: React.ReactNode;
  className?: string;
};

/** Placeholder for a field the merchant did not fill in. */
const EMPTY = "—";

/**
 * One label / value row of a read-only review section. Values are never inputs:
 * compliance reads the submission back, it does not edit it.
 */
const ComplianceReviewField = ({
  label,
  value,
  dir,
  mono = false,
  children,
  className,
}: ComplianceReviewFieldProps) => {
  const isBlank = !children && !value?.trim();

  return (
    <div
      className={cn(
        "grid gap-2 border-b border-slate-100 py-3.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] sm:items-baseline sm:gap-6",
        className,
      )}
    >
      <dt className="text-sm text-slate-400">{label}</dt>

      <dd
        dir={dir}
        className={cn(
          "text-sm font-medium break-words",
          mono && "font-mono",
          isBlank ? "text-slate-300" : "text-slate-900",
        )}
      >
        {children ?? (isBlank ? EMPTY : value)}
      </dd>
    </div>
  );
};

export default ComplianceReviewField;
export { ComplianceReviewField };
export type { ComplianceReviewFieldProps };
