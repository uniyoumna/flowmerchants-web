import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain digits only"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;
