import { appendFile, appendList, appendText } from "@/utils/formData";
import {
  MERCHANT_GENERAL_INFO_DEFAULTS,
  type MerchantGeneralInfoValues,
} from "../schemas/merchantGeneralInfoSchema";
import type { ApiMerchantGeneralInfo } from "../types";

/**
 * Step 1 form values → multipart body.
 *
 * Files force multipart, so every field on this step travels as FormData rather
 * than JSON.
 */
export function buildGeneralInfoFormData(
  values: MerchantGeneralInfoValues,
): FormData {
  const formData = new FormData();

  // ─── Business identity ───
  appendFile(formData, "logo", values.logo);
  appendText(formData, "commercial_name_en", values.commercialNameEn);
  appendText(formData, "commercial_name_ar", values.commercialNameAr);

  // ─── Contact details ───
  appendText(formData, "primary_contact_name", values.primaryContactName);
  appendText(formData, "primary_contact_email", values.email);
  appendText(formData, "primary_contact_mobile", values.mobileNumber);
  appendText(formData, "primary_contact_landline", values.landline ?? "");
  appendText(formData, "website", values.website ?? "");
  appendText(formData, "mobile_app_deep_link", values.mobileAppDeepLink ?? "");

  // ─── Address ───
  appendText(formData, "governorate", values.governorate);
  appendText(formData, "city", values.city);
  appendText(formData, "area", values.area ?? "");
  appendText(formData, "full_address", values.fullAddress ?? "");

  // ─── Classification ───
  appendList(formData, "business_types", values.businessTypes);
  appendList(formData, "assigned_products", values.loanProducts);

  // ─── Legal documents ───
  appendText(formData, "name_en", values.registeredNameEn);
  appendText(formData, "name_ar", values.registeredNameAr);
  appendText(formData, "commercial_registration_number", values.crNumber);
  appendText(formData, "vat_number", values.vatNumber);
  appendFile(formData, "cr_document", values.crDocument);
  appendFile(formData, "vat_certificate", values.vatCertificate);

  return formData;
}

/**
 * Saved step 1 → form values, so going back renders a populated, editable form.
 * Every missing key falls back to its blank default rather than `undefined`,
 * which would flip the inputs from controlled to uncontrolled.
 */
export function mapApiGeneralInfo(
  api: ApiMerchantGeneralInfo,
): MerchantGeneralInfoValues {
  const defaults = MERCHANT_GENERAL_INFO_DEFAULTS;

  return {
    logo: api.logo ?? defaults.logo,
    commercialNameEn: api.commercial_name_en ?? defaults.commercialNameEn,
    commercialNameAr: api.commercial_name_ar ?? defaults.commercialNameAr,

    primaryContactName: api.primary_contact_name ?? defaults.primaryContactName,
    email: api.primary_contact_email ?? defaults.email,
    mobileNumber: api.primary_contact_mobile ?? defaults.mobileNumber,
    landline: api.primary_contact_landline ?? defaults.landline,
    website: api.website ?? defaults.website,
    mobileAppDeepLink: api.mobile_app_deep_link ?? defaults.mobileAppDeepLink,

    governorate: api.governorate ?? defaults.governorate,
    city: api.city ?? defaults.city,
    area: api.area ?? defaults.area,
    fullAddress: api.full_address ?? defaults.fullAddress,

    businessTypes: api.business_types ?? defaults.businessTypes,
    loanProducts: api.assigned_products ?? defaults.loanProducts,

    registeredNameEn: api.name_en ?? defaults.registeredNameEn,
    registeredNameAr: api.name_ar ?? defaults.registeredNameAr,
    crNumber: api.commercial_registration_number ?? defaults.crNumber,
    vatNumber: api.vat_number ?? defaults.vatNumber,
    crDocument: api.cr_document ?? defaults.crDocument,
    vatCertificate: api.vat_certificate ?? defaults.vatCertificate,
  };
}
