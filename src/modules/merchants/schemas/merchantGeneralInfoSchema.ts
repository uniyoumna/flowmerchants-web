import { z } from "zod";
import { requiredFileSchema } from "@/utils/fileSchema";

/**
 * Step 1 — General Information
 *
 * FE-016 says these formats are configurable server-side, so the patterns below
 * are the shipping defaults for the Egyptian deployment only. FE-267 still
 * applies: the backend revalidates everything checked here.
 */

// TODO: source from the configurable-format endpoint.
const EG_MOBILE_PATTERN = /^(\+?20|0)?1[0125]\d{8}$/;
const EG_LANDLINE_PATTERN = /^(\+?20)?[2-9]\d{6,8}$/;

/** Phone inputs are typed with spaces and dashes; compare the digits only. */
const digitsOnly = (value: string) => value.replace(/[\s()-]/g, "");

const arabicText = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters")
  .regex(/[؀-ۿ]/, "Please use Arabic characters");

const englishText = z
  .string()
  .trim()
  .min(2, "Enter at least 2 characters")
  .regex(/^[A-Za-z0-9\s&.,'()-]+$/, "Please use English characters");

/** Optional URL field — an untouched input is `""`, not an invalid URL. */
const optionalUrl = (message: string) =>
  z.union([z.literal(""), z.url(message)]).default("");

const merchantGeneralInfoSchema = z.object({
  // ─── Business identity ───
  logo: requiredFileSchema("Merchant logo is required"),
  commercialNameEn: englishText,
  commercialNameAr: arabicText,

  // ─── Contact details ───
  primaryContactName: z.string().trim().min(3, "Enter the full contact name"),
  email: z.email("Enter a valid email address"),
  mobileNumber: z
    .string()
    .trim()
    .min(1, "Mobile number is required")
    .refine(
      (value) => EG_MOBILE_PATTERN.test(digitsOnly(value)),
      "Enter a valid Egyptian mobile number",
    ),
  landline: z
    .string()
    .trim()
    .default("")
    .refine(
      (value) => value === "" || EG_LANDLINE_PATTERN.test(digitsOnly(value)),
      "Enter a valid Egyptian landline number",
    ),
  website: optionalUrl("Enter a valid website URL"),
  mobileAppDeepLink: optionalUrl("Enter a valid deep link"),

  // ─── Address (FE-017) ───
  governorate: z.string().min(1, "Select a governorate"),
  city: z.string().min(1, "Select a city"),
  area: z.string().default(""),
  fullAddress: z
    .string()
    .trim()
    .max(255, "Keep it under 255 characters")
    .default(""),

  // ─── Classification (FE-018, FE-019) ───
  businessTypes: z
    .array(z.string())
    .min(1, "Select at least one business type"),
  loanProducts: z.array(z.string()).min(1, "Select at least one loan product"),

  // ─── Legal documents (FE-031) ───
  registeredNameEn: englishText,
  registeredNameAr: arabicText,
  crNumber: z
    .string()
    .trim()
    .min(4, "Enter the commercial registration number"),
  vatNumber: z.string().trim().min(4, "Enter the VAT registration number"),
  crDocument: requiredFileSchema(
    "Commercial registration document is required",
  ),
  vatCertificate: requiredFileSchema("VAT certificate is required"),
});

type MerchantGeneralInfoValues = z.input<typeof merchantGeneralInfoSchema>;

/** Blank step 1 — also the shape the API response is mapped back onto. */
const MERCHANT_GENERAL_INFO_DEFAULTS: MerchantGeneralInfoValues = {
  logo: null,
  commercialNameEn: "",
  commercialNameAr: "",
  primaryContactName: "",
  email: "",
  mobileNumber: "",
  landline: "",
  website: "",
  mobileAppDeepLink: "",
  governorate: "",
  city: "",
  area: "",
  fullAddress: "",
  businessTypes: [],
  loanProducts: [],
  registeredNameEn: "",
  registeredNameAr: "",
  crNumber: "",
  vatNumber: "",
  crDocument: null,
  vatCertificate: null,
};

export { MERCHANT_GENERAL_INFO_DEFAULTS, merchantGeneralInfoSchema };
export type { MerchantGeneralInfoValues };
