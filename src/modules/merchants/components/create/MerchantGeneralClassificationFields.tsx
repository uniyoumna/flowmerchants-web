"use client";

import { FormMultiSelect } from "@/components/form";
import { BUSINESS_TYPE_OPTIONS, LOAN_PRODUCT_OPTIONS } from "../../constants";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** US-007 — the merchant's operating scope: what it sells and what it can offer. */
const MerchantGeneralClassificationFields = () => {
  return (
    <MerchantStepFieldset title="Classification">
      <FormMultiSelect
        name="businessTypes"
        label="Business Types"
        required
        placeholder="Select..."
        options={BUSINESS_TYPE_OPTIONS}
      />

      <FormMultiSelect
        name="loanProducts"
        label="Associated loan products"
        required
        placeholder="Select..."
        options={LOAN_PRODUCT_OPTIONS}
      />
    </MerchantStepFieldset>
  );
};

export default MerchantGeneralClassificationFields;
export { MerchantGeneralClassificationFields };
