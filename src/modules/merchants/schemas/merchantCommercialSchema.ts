import { z } from "zod";
import { DEFAULT_CURRENCY } from "../constants";

/**
 * Step 5 — Commercial configuration
 *
 * Amounts stay strings end to end: they arrive from `<input>` as strings and
 * leave as multipart fields, so coercing to `number` in between would only add
 * a rounding surface for money.
 */

const decimal = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid amount");

const wholeNumber = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine(
      (value) => /^\d+$/.test(value) && Number(value) > 0,
      "Enter a positive whole number",
    );

const merchantCommercialSchema = z
  .object({
    currency: z.string().min(1, "Select a currency"),
    minTicketSize: decimal("Minimum ticket size is required"),
    maxTicketSize: decimal("Maximum ticket size is required"),
    maxBranches: wholeNumber("Maximum branches is required"),
    maxSalesPersons: wholeNumber("Maximum sales persons is required"),
  })
  .refine(
    ({ minTicketSize, maxTicketSize }) =>
      Number(maxTicketSize) >= Number(minTicketSize),
    {
      // FE-025 — max must be greater than or equal to min.
      message:
        "Maximum ticket size must be greater than or equal to the minimum",
      path: ["maxTicketSize"],
    },
  );

type MerchantCommercialValues = z.input<typeof merchantCommercialSchema>;

const MERCHANT_COMMERCIAL_DEFAULTS: MerchantCommercialValues = {
  currency: DEFAULT_CURRENCY,
  minTicketSize: "",
  maxTicketSize: "",
  maxBranches: "",
  maxSalesPersons: "",
};

export { MERCHANT_COMMERCIAL_DEFAULTS, merchantCommercialSchema };
export type { MerchantCommercialValues };
