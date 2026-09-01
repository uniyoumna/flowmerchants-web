"use client";

import { FormFileUpload, FormInput } from "@/components/form";
import { DOCUMENT_UPLOAD_ACCEPT, MAX_UPLOAD_SIZE_MB } from "../../constants";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** US-008, US-009, FE-031 — registered entity, CR and VAT with their evidence. */
const MerchantGeneralLegalFields = () => {
  return (
    <MerchantStepFieldset title="Legal Documents">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          name="registeredNameEn"
          label="Registered Business Name (English)"
          required
          placeholder="Cairo Electronics Co."
        />

        <FormInput
          name="registeredNameAr"
          label="Registered Business Name (Arabic)"
          required
          dir="rtl"
          placeholder="شركة كايرو للإلكترونيات"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          name="crNumber"
          label="CR Number"
          required
          placeholder="CR-YYYYNNNN"
        />

        <FormInput
          name="vatNumber"
          label="VAT Number"
          required
          placeholder="VAT-NNNNNNN"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormFileUpload
          name="crDocument"
          label="CR Document"
          required
          height="sm"
          accept={DOCUMENT_UPLOAD_ACCEPT}
          maxSizeMb={MAX_UPLOAD_SIZE_MB}
        />

        <FormFileUpload
          name="vatCertificate"
          label="VAT Certificate"
          required
          height="sm"
          accept={DOCUMENT_UPLOAD_ACCEPT}
          maxSizeMb={MAX_UPLOAD_SIZE_MB}
        />
      </div>
    </MerchantStepFieldset>
  );
};

export default MerchantGeneralLegalFields;
export { MerchantGeneralLegalFields };
