"use client";

import { FormInput } from "@/components/form";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** US-005, US-010 — how Flow reaches the merchant, plus its digital channels. */
const MerchantGeneralContactFields = () => {
  return (
    <MerchantStepFieldset title="Contact Details">
      <FormInput
        name="primaryContactName"
        label="Primary Contact Name"
        required
        placeholder="Full name"
        autoComplete="name"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          name="email"
          label="Email Address"
          required
          type="email"
          placeholder="contact@merchant.com"
          autoComplete="email"
        />

        <FormInput
          name="mobileNumber"
          label="Mobile Number"
          required
          type="tel"
          placeholder="+20 10 0000 0000"
          autoComplete="tel"
        />
      </div>

      <FormInput
        name="landline"
        label="Landline"
        type="tel"
        placeholder="+20 2 XXXX XXXX"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          name="website"
          label="Merchant Website"
          type="url"
          placeholder="https://www.merchant.com"
        />

        <FormInput
          name="mobileAppDeepLink"
          label="Mobile App Deep Link"
          placeholder="myapp://merchant/..."
        />
      </div>
    </MerchantStepFieldset>
  );
};

export default MerchantGeneralContactFields;
export { MerchantGeneralContactFields };
