"use client";

import { FormProvider } from "react-hook-form";
import { FormFileUpload, FormInput } from "@/components/form";
import { IMAGE_UPLOAD_ACCEPT, MAX_UPLOAD_SIZE_MB } from "../../constants";
import { useMerchantStepForm } from "../../hooks/useMerchantStepForm";
import {
  type MerchantAgreementValues,
  merchantAgreementSchema,
} from "../../schemas/merchantAgreementSchema";
import { buildAgreementFormData } from "../../utils/merchantStepMappers";
import { MerchantCreateFooter } from "./MerchantCreateFooter";

type MerchantAgreementFormProps = {
  draftId: string | null;
  defaultValues: MerchantAgreementValues;
};

/** Step 2 — Agreement (US-012, FE-033). */
const MerchantAgreementForm = ({
  draftId,
  defaultValues,
}: MerchantAgreementFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    serverError,
    goToPreviousStep,
    hasPreviousStep,
    isLastStep,
  } = useMerchantStepForm<MerchantAgreementValues>({
    step: "agreement",
    draftId,
    schema: merchantAgreementSchema,
    defaultValues,
    toFormData: buildAgreementFormData,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
          <FormFileUpload
            name="signedAgreement"
            label="Signed Agreement"
            required
            height="sm"
            accept={IMAGE_UPLOAD_ACCEPT}
            maxSizeMb={MAX_UPLOAD_SIZE_MB}
            containerClassName="max-w-md"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              name="agreementReference"
              label="Agreement Reference Number"
              placeholder="AGR-2025-XXXXX"
            />

            <FormInput
              name="signatureDate"
              label="Signature Date"
              type="date"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormInput
              name="effectiveDate"
              label="Effective Date"
              required
              type="date"
            />
          </div>
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

export default MerchantAgreementForm;
export { MerchantAgreementForm };
export type { MerchantAgreementFormProps };
