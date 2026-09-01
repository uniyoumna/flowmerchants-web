import { z } from "zod";

/**
 * Merchant financial configuration.
 *
 * Amounts and day counts stay strings end to end: they arrive from `<input>` as
 * strings and leave as JSON, so coercing to `number` in between would only add
 * a rounding surface for money. The refinements below are what enforce the
 * numeric rules.
 */

const wholeNumber = z
  .string()
  .trim()
  .refine((value) => /^\d+$/.test(value), "Enter a whole number");

const decimal = z
  .string()
  .trim()
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), "Enter a valid amount");

export const CYCLE_TYPES = ["daily", "weekly", "monthly", "instant"] as const;
export const CYCLE_FREQUENCIES = ["once", "multiple"] as const;
export const FEE_TYPES = ["fixed", "percentage"] as const;
export const FEE_COLLECTED_FROM = ["customer", "merchant"] as const;
export const CAP_PERIODS = ["daily", "refund_window", "month"] as const;
export const REFUND_TYPES = ["full", "partial"] as const;
export const REBATE_STRUCTURES = ["fixed", "slab"] as const;
export const REBATE_VALUE_TYPES = ["fixed", "percentage"] as const;

const merchantConfigSchema = z
  .object({
    // ─── Settlement cycle ───
    cycleType: z.enum(CYCLE_TYPES),
    frequency: z.enum(CYCLE_FREQUENCIES),
    hasRefundWindow: z.boolean().default(false),
    refundWindowMin: z.string().trim().default(""),
    refundWindowMax: z.string().trim().default(""),

    // ─── Fee configuration ───
    feeType: z.enum(FEE_TYPES),
    feeValue: decimal,
    collectedFrom: z.enum(FEE_COLLECTED_FROM),
    maxRefundOrders: wholeNumber,
    capPeriod: z.enum(CAP_PERIODS),

    // ─── Refund configuration ───
    refundEnabled: z.boolean().default(false),
    refundType: z.enum(REFUND_TYPES),

    // ─── Rebate configuration ───
    rebateStructure: z.enum(REBATE_STRUCTURES),
    rebateValueType: z.enum(REBATE_VALUE_TYPES),
    rebateValue: decimal,

    // ─── Fee eligibility ───
    downPayment: z.boolean().default(false),
    upfrontAdminFees: z.boolean().default(false),
    cancellationFees: z.boolean().default(false),
  })
  .superRefine((values, ctx) => {
    // A percentage is a share, so it cannot exceed 100 — a fixed fee can be
    // any amount, which is why the ceiling is conditional.
    if (values.feeType === "percentage" && Number(values.feeValue) > 100) {
      ctx.addIssue({
        code: "custom",
        message: "A percentage fee cannot exceed 100%",
        path: ["feeValue"],
      });
    }

    if (
      values.rebateValueType === "percentage" &&
      Number(values.rebateValue) > 100
    ) {
      ctx.addIssue({
        code: "custom",
        message: "A percentage rebate cannot exceed 100%",
        path: ["rebateValue"],
      });
    }

    // The window bounds only exist when the merchant has a refund window.
    if (!values.hasRefundWindow) return;

    if (!/^\d+$/.test(values.refundWindowMin)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the minimum number of days",
        path: ["refundWindowMin"],
      });
    }

    if (!/^\d+$/.test(values.refundWindowMax)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter the maximum number of days",
        path: ["refundWindowMax"],
      });
      return;
    }

    if (Number(values.refundWindowMax) < Number(values.refundWindowMin)) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum must be greater than or equal to the minimum",
        path: ["refundWindowMax"],
      });
    }
  });

type MerchantConfigValues = z.input<typeof merchantConfigSchema>;

/** Blank configuration — also the shape a saved config is mapped back onto. */
const MERCHANT_CONFIG_DEFAULTS: MerchantConfigValues = {
  cycleType: "monthly",
  frequency: "once",
  hasRefundWindow: true,
  refundWindowMin: "1",
  refundWindowMax: "30",
  feeType: "percentage",
  feeValue: "",
  collectedFrom: "merchant",
  maxRefundOrders: "",
  capPeriod: "month",
  refundEnabled: true,
  refundType: "full",
  rebateStructure: "fixed",
  rebateValueType: "percentage",
  rebateValue: "",
  downPayment: false,
  upfrontAdminFees: true,
  cancellationFees: false,
};

export { MERCHANT_CONFIG_DEFAULTS, merchantConfigSchema };
export type { MerchantConfigValues };
