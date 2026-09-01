"use client";

import { FormProvider } from "react-hook-form";
import { FormInput } from "@/components/form";
import { useMerchantStepForm } from "../../hooks/useMerchantStepForm";
import {
  type MerchantContactsValues,
  merchantContactsSchema,
} from "../../schemas/merchantContactsSchema";
import { buildContactsFormData } from "../../utils/merchantStepMappers";
import { MerchantAccountManagersFields } from "./MerchantAccountManagersFields";
import { MerchantCreateFooter } from "./MerchantCreateFooter";
import { MerchantEscalationContactsFields } from "./MerchantEscalationContactsFields";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

type MerchantContactsFormProps = {
  draftId: string | null;
  defaultValues: MerchantContactsValues;
};

/** Step 3 — Operational Contacts (US-011, FE-021, FE-022). */
const MerchantContactsForm = ({
  draftId,
  defaultValues,
}: MerchantContactsFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    serverError,
    goToPreviousStep,
    hasPreviousStep,
    isLastStep,
  } = useMerchantStepForm<MerchantContactsValues>({
    step: "contacts",
    draftId,
    schema: merchantContactsSchema,
    defaultValues,
    toFormData: buildContactsFormData,
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
          <MerchantStepFieldset title="Finance Contact" withDivider={false}>
            <FormInput
              name="financeEmail"
              label="Finance Team Contact Email"
              required
              type="email"
              placeholder="finance@merchant.com"
            />
          </MerchantStepFieldset>

          <MerchantEscalationContactsFields />
          <MerchantAccountManagersFields />
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

export default MerchantContactsForm;
export { MerchantContactsForm };
export type { MerchantContactsFormProps };
