import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MERCHANT_STEP_META } from "../../constants";
import type { MerchantCreateStep, MerchantStepState } from "../../types";

type MerchantCreateStepperItemProps = {
  step: MerchantCreateStep;
  state: MerchantStepState;
  /** Set for every step except the current one — makes the item a link. */
  href?: string;
};

const STATE_LABELS: Record<MerchantStepState, string> = {
  completed: "Completed",
  current: "In Progress",
  pending: "Pending",
};

const STATE_LABEL_STYLES: Record<MerchantStepState, string> = {
  completed: "text-emerald-600",
  current: "text-[#7C3AED]",
  pending: "text-slate-400",
};

/** The circle: filled tick when done, ring when active, faint dot when queued. */
const StepIndicator = ({ state }: { state: MerchantStepState }) => {
  if (state === "completed") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#4C1D95]">
        <span className="size-2.5 rounded-full bg-[#4C1D95]" />
      </span>
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-100">
      <span className="size-1.5 rounded-full bg-purple-300" />
    </span>
  );
};

const MerchantCreateStepperItem = ({
  step,
  state,
  href,
}: MerchantCreateStepperItemProps) => {
  const meta = MERCHANT_STEP_META[step];

  const content = (
    <>
      <StepIndicator state={state} />

      <span className="flex flex-col">
        <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
          Step {meta.order}
        </span>
        <span
          className={cn(
            "text-sm font-semibold whitespace-nowrap",
            state === "pending" ? "text-slate-400" : "text-slate-900",
          )}
        >
          {meta.label}
        </span>
        <span className={cn("text-xs", STATE_LABEL_STYLES[state])}>
          {STATE_LABELS[state]}
        </span>
      </span>
    </>
  );

  const className = "flex shrink-0 items-center gap-2.5";

  // The current step is plain text; every other step navigates.
  if (href) {
    return (
      <Link
        href={href}
        aria-current={state === "current" ? "step" : undefined}
        className={cn(
          className,
          "cursor-pointer rounded-lg transition-opacity hover:opacity-80",
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={className}
      aria-current={state === "current" ? "step" : undefined}
    >
      {content}
    </div>
  );
};

export default MerchantCreateStepperItem;
export { MerchantCreateStepperItem };
export type { MerchantCreateStepperItemProps };
