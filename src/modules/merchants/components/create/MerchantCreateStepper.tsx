import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { MERCHANT_CREATE_STEPS, type MerchantCreateStep } from "../../types";
import {
  buildMerchantCreateHref,
  getStepState,
} from "../../utils/merchantCreateQuery";
import { MerchantCreateStepperItem } from "./MerchantCreateStepperItem";

type MerchantCreateStepperProps = {
  currentStep: MerchantCreateStep;
  draftId: string | null;
};

/**
 * The five-step rail.
 *
 * Every step is a link: the wizard is URL-driven, so jumping around is just
 * navigation and each step re-reads its own saved data on arrival. Completeness
 * is enforced when the application is submitted (FE-035), not by hiding steps.
 */
const MerchantCreateStepper = ({
  currentStep,
  draftId,
}: MerchantCreateStepperProps) => {
  return (
    <div className="border-t border-slate-100 px-6 py-4 lg:px-8">
      <ol className="flex items-center gap-3 overflow-x-auto">
        {MERCHANT_CREATE_STEPS.map((step, index) => {
          const state = getStepState(step, currentStep);

          return (
            <Fragment key={step}>
              {index > 0 && (
                <li aria-hidden className="min-w-6 flex-1">
                  <span
                    className={cn(
                      "block h-0.5 rounded-full",
                      state === "pending" ? "bg-slate-200" : "bg-[#7C3AED]",
                    )}
                  />
                </li>
              )}

              <li>
                <MerchantCreateStepperItem
                  step={step}
                  state={state}
                  href={
                    state === "current"
                      ? undefined
                      : buildMerchantCreateHref({ step, draftId })
                  }
                />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
};

export default MerchantCreateStepper;
export { MerchantCreateStepper };
export type { MerchantCreateStepperProps };
