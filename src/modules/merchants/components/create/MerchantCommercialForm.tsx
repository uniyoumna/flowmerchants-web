"use client";

import { FormProvider } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/form";
import { CURRENCY_OPTIONS } from "../../constants";
import { useMerchantStepForm } from "../../hooks/useMerchantStepForm";
import {
  type MerchantCommercialValues,
  merchantCommercialSchema,
} from "../../schemas/merchantCommercialSchema";
import { buildCommercialFormData } from "../../utils/merchantStepMappers";
import { MerchantCreateFooter } from "./MerchantCreateFooter";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

type MerchantCommercialFormProps = {
  draftId: string | null;
  defaultValues: MerchantCommercialValues;
};

/** Step 5 — Commercial Config (US-016, US-017, FE-024 … FE-026). */
const MerchantCommercialForm = ({
  draftId,
  defaultValues,
}: MerchantCommercialFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    serverError,
    goToPreviousStep,
    hasPreviousStep,
    isLastStep,
  } = useMerchantStepForm<MerchantCommercialValues>({
    step: "commercial",
    draftId,
    schema: merchantCommercialSchema,
    defaultValues,
    toFormData: buildCommercialFormData,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
          <MerchantStepFieldset title="Ticket Size Limits" withDivider={false}>
            <div className="grid gap-5 md:grid-cols-3">
              <FormInput
                name="minTicketSize"
                label="Minimum Ticket Size"
                required
                inputMode="decimal"
                placeholder="5000"
              />
              <FormInput
                name="maxTicketSize"
                label="Maximum Ticket Size"
                required
                inputMode="decimal"
                placeholder="100000"
              />
              <FormSelect
                name="currency"
                label="Currency"
                required
                options={CURRENCY_OPTIONS}
                className="w-full"
              />
            </div>
          </MerchantStepFieldset>

          <MerchantStepFieldset title="Capacity Limits">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                name="maxBranches"
                label="Maximum Branches"
                required
                inputMode="numeric"
                placeholder="50"
              />
              <FormInput
                name="maxSalesPersons"
                label="Maximum Sales Persons"
                required
                inputMode="numeric"
                placeholder="200"
              />
            </div>
          </MerchantStepFieldset>
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

export default MerchantCommercialForm;
export { MerchantCommercialForm };
export type { MerchantCommercialFormProps };
