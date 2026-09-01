import { ChevronLeft, ChevronRight } from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";

type MerchantCreateFooterProps = {
  hasPreviousStep: boolean;
  onPrevious: () => void;
  isSubmitting: boolean;
  /** The final step submits the whole application for review (FE-051). */
  isLastStep: boolean;
};

/**
 * Sticky action bar for the wizard. It stays pinned to the bottom of the
 * viewport while the step body scrolls, and the negative margins let it span
 * the full width of the padded step area.
 */
const MerchantCreateFooter = ({
  hasPreviousStep,
  onPrevious,
  isSubmitting,
  isLastStep,
}: MerchantCreateFooterProps) => {
  return (
    <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-auto flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 lg:-mx-8 lg:-mb-8 lg:px-8">
      {hasPreviousStep ? (
        <BaseButton
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="h-11 rounded-xl border-slate-200 px-5 font-semibold text-slate-700"
        >
          <ChevronLeft className="mr-1 size-4" />
          Previous
        </BaseButton>
      ) : (
        // Keeps "Save & Continue" right-aligned on the first step.
        <span />
      )}

      <BaseButton
        type="submit"
        isLoading={isSubmitting}
        loadingText="Saving..."
        className="h-11 rounded-xl bg-linear-to-r from-[#7C3AED] to-[#A855F7] px-6 font-semibold text-white shadow-sm transition-all hover:from-[#6D28D9] hover:to-[#9333EA]"
      >
        {isLastStep ? "Submit to Compliance" : "Save & Continue"}
        <ChevronRight className="ml-1 size-4" />
      </BaseButton>
    </div>
  );
};

export default MerchantCreateFooter;
export { MerchantCreateFooter };
export type { MerchantCreateFooterProps };
