"use client";

import { FormFileUpload, FormInput } from "@/components/form";
import { IMAGE_UPLOAD_ACCEPT, MAX_UPLOAD_SIZE_MB } from "../../constants";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** US-004 — logo and the bilingual commercial (trading) name. */
const MerchantGeneralIdentityFields = () => {
  return (
    <MerchantStepFieldset title="Business Identity" withDivider={false}>
      <FormFileUpload
        name="logo"
        label="Merchant Logo"
        required
        accept={IMAGE_UPLOAD_ACCEPT}
        maxSizeMb={MAX_UPLOAD_SIZE_MB}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          name="commercialNameEn"
          label="Commercial Name (English)"
          required
          placeholder="Cairo Electronics"
        />

        <FormInput
          name="commercialNameAr"
          label="Commercial Name (Arabic)"
          required
          dir="rtl"
          placeholder="كايرو للإلكترونيات"
        />
      </div>
    </MerchantStepFieldset>
  );
};

export default MerchantGeneralIdentityFields;
export { MerchantGeneralIdentityFields };
