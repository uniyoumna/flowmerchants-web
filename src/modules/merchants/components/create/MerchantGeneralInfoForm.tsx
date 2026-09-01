"use client";

import { FormProvider } from "react-hook-form";
import { useMerchantStepForm } from "../../hooks/useMerchantStepForm";
import {
  type MerchantGeneralInfoValues,
  merchantGeneralInfoSchema,
} from "../../schemas/merchantGeneralInfoSchema";
import { buildGeneralInfoFormData } from "../../utils/merchantGeneralInfoMapper";
import { MerchantCreateFooter } from "./MerchantCreateFooter";
import { MerchantGeneralAddressFields } from "./MerchantGeneralAddressFields";
import { MerchantGeneralClassificationFields } from "./MerchantGeneralClassificationFields";
import { MerchantGeneralContactFields } from "./MerchantGeneralContactFields";
import { MerchantGeneralIdentityFields } from "./MerchantGeneralIdentityFields";
import { MerchantGeneralLegalFields } from "./MerchantGeneralLegalFields";

type MerchantGeneralInfoFormProps = {
  draftId: string | null;
  /** Saved step 1, or the blank defaults when the draft has not reached it. */
  defaultValues: MerchantGeneralInfoValues;
};

/**
 * Step 1 — General Information.
 *
 * The form is only an assembly of field groups: validation lives in the schema,
 * submission and navigation in `useMerchantStepForm`. `FormProvider` lets each
 * group bind by field name without threading `control` through every level.
 */
const MerchantGeneralInfoForm = ({
  draftId,
  defaultValues,
}: MerchantGeneralInfoFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    serverError,
    goToPreviousStep,
    hasPreviousStep,
    isLastStep,
  } = useMerchantStepForm<MerchantGeneralInfoValues>({
    step: "general",
    draftId,
    schema: merchantGeneralInfoSchema,
    defaultValues,
    toFormData: buildGeneralInfoFormData,
  });

  return (
    <FormProvider {...form}>
      {/* noValidate — zod owns validation; native bubbles would compete. */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
          <MerchantGeneralIdentityFields />
          <MerchantGeneralContactFields />
          <MerchantGeneralAddressFields />
          <MerchantGeneralClassificationFields />
          <MerchantGeneralLegalFields />
        </div>

        {serverError && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}

        <MerchantCreateFooter
          hasPreviousStep={hasPreviousStep}
          onPrevious={goToPreviousStep}
          isSubmitting={isSubmitting}
          isLastStep={isLastStep}
        />
      </form>
    </FormProvider>
  );
};

export default MerchantGeneralInfoForm;
export { MerchantGeneralInfoForm };
export type { MerchantGeneralInfoFormProps };
