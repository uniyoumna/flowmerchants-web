import { z } from "zod";
import { requiredFileSchema } from "@/utils/fileSchema";

/** Step 2  */
const merchantAgreementSchema = z
  .object({
    signedAgreement: requiredFileSchema("The signed agreement is required"),
    agreementReference: z.string().trim().default(""),
    signatureDate: z.string().default(""),
    effectiveDate: z.string().min(1, "Effective date is required"),
  })
  .refine(
    ({ signatureDate, effectiveDate }) =>
      !signatureDate || !effectiveDate || signatureDate <= effectiveDate,
    {
      // ISO `yyyy-mm-dd` strings compare correctly as plain strings.
      message: "Effective date cannot be before the signature date",
      path: ["effectiveDate"],
    },
  );

type MerchantAgreementValues = z.input<typeof merchantAgreementSchema>;

const MERCHANT_AGREEMENT_DEFAULTS: MerchantAgreementValues = {
  signedAgreement: null,
  agreementReference: "",
  signatureDate: "",
  effectiveDate: "",
};

export { MERCHANT_AGREEMENT_DEFAULTS, merchantAgreementSchema };
export type { MerchantAgreementValues };
