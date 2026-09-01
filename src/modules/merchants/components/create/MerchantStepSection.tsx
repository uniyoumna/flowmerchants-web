import {
  MERCHANT_AGREEMENT_DEFAULTS,
  type MerchantAgreementValues,
} from "../../schemas/merchantAgreementSchema";
import {
  MERCHANT_BANK_ACCOUNTS_DEFAULTS,
  type MerchantBankAccountsValues,
} from "../../schemas/merchantBankAccountsSchema";
import {
  MERCHANT_COMMERCIAL_DEFAULTS,
  type MerchantCommercialValues,
} from "../../schemas/merchantCommercialSchema";
import {
  MERCHANT_CONTACTS_DEFAULTS,
  type MerchantContactsValues,
} from "../../schemas/merchantContactsSchema";
import {
  MERCHANT_GENERAL_INFO_DEFAULTS,
  type MerchantGeneralInfoValues,
} from "../../schemas/merchantGeneralInfoSchema";
import { fetchMerchantStep } from "../../services/merchantCreateService";
import type {
  ApiMerchantAgreement,
  ApiMerchantBankAccounts,
  ApiMerchantCommercialConfig,
  ApiMerchantContacts,
  ApiMerchantGeneralInfo,
  MerchantCreateStep,
  MerchantStepData,
} from "../../types";
import { mapApiGeneralInfo } from "../../utils/merchantGeneralInfoMapper";
import {
  mapApiAgreement,
  mapApiBankAccounts,
  mapApiCommercial,
  mapApiContacts,
} from "../../utils/merchantStepMappers";
import { MerchantAgreementForm } from "./MerchantAgreementForm";
import { MerchantBankAccountsForm } from "./MerchantBankAccountsForm";
import { MerchantCommercialForm } from "./MerchantCommercialForm";
import { MerchantContactsForm } from "./MerchantContactsForm";
import { MerchantGeneralInfoForm } from "./MerchantGeneralInfoForm";
import { MerchantStepLoadError } from "./MerchantStepLoadError";

type MerchantStepSectionProps = {
  step: MerchantCreateStep;
  draftId: string | null;
};

/**
 * Loads whichever step the URL points at and hands its saved values to that
 * step's form.
 *
 * Fetching on the server is what makes going back an edit rather than a
 * re-entry (US-003): the form arrives already populated. `data` is `null` for a
 * step the draft has not reached yet, which resolves to the blank defaults.
 *
 * Adding a step means adding a case here plus its schema, mapper and form —
 * nothing in the wizard shell changes.
 */
const MerchantStepSection = async ({
  step,
  draftId,
}: MerchantStepSectionProps) => {
  const { data, error } = await fetchMerchantStep({ step, draftId });

  if (error) {
    return <MerchantStepLoadError message={error} />;
  }

  /** Saved values when the step exists, the step's blank defaults otherwise. */
  const valuesOr = <TApi, TValues>(
    map: (api: TApi) => TValues,
    defaults: TValues,
    saved: MerchantStepData,
  ): TValues => (saved ? map(saved as TApi) : defaults);

  switch (step) {
    case "general":
      return (
        <MerchantGeneralInfoForm
          draftId={draftId}
          defaultValues={valuesOr<
            ApiMerchantGeneralInfo,
            MerchantGeneralInfoValues
          >(mapApiGeneralInfo, MERCHANT_GENERAL_INFO_DEFAULTS, data)}
        />
      );

    case "agreement":
      return (
        <MerchantAgreementForm
          draftId={draftId}
          defaultValues={valuesOr<
            ApiMerchantAgreement,
            MerchantAgreementValues
          >(mapApiAgreement, MERCHANT_AGREEMENT_DEFAULTS, data)}
        />
      );

    case "contacts":
      return (
        <MerchantContactsForm
          draftId={draftId}
          defaultValues={valuesOr<ApiMerchantContacts, MerchantContactsValues>(
            mapApiContacts,
            MERCHANT_CONTACTS_DEFAULTS,
            data,
          )}
        />
      );

    case "bank":
      return (
        <MerchantBankAccountsForm
          draftId={draftId}
          defaultValues={valuesOr<
            ApiMerchantBankAccounts,
            MerchantBankAccountsValues
          >(mapApiBankAccounts, MERCHANT_BANK_ACCOUNTS_DEFAULTS, data)}
        />
      );

    case "commercial":
      return (
        <MerchantCommercialForm
          draftId={draftId}
          defaultValues={valuesOr<
            ApiMerchantCommercialConfig,
            MerchantCommercialValues
          >(mapApiCommercial, MERCHANT_COMMERCIAL_DEFAULTS, data)}
        />
      );
  }
};

export default MerchantStepSection;
export { MerchantStepSection };
export type { MerchantStepSectionProps };
