import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MerchantStepFieldsetProps = {
  /** Section heading inside the step card, e.g. "Business Identity". */
  title: string;
  /** Optional line under the heading explaining the section's rule. */
  description?: string;
  /** Divider above the section — omitted on the first one in a card. */
  withDivider?: boolean;
  children: ReactNode;
};

/** One titled group of fields inside a step card. */
const MerchantStepFieldset = ({
  title,
  description,
  withDivider = true,
  children,
}: MerchantStepFieldsetProps) => {
  return (
    <fieldset
      className={cn(
        "space-y-5",
        withDivider && "border-t border-slate-100 pt-6",
      )}
    >
      <legend className="sr-only">{title}</legend>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      {children}
    </fieldset>
  );
};

export default MerchantStepFieldset;
export { MerchantStepFieldset };
export type { MerchantStepFieldsetProps };
