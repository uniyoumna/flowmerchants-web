import type { Metadata } from "next";
import { OtpPageContent } from "@/modules/auth/otp/components/OtpPageContent";

export const metadata: Metadata = {
  title: "Verify Code | Flow",
  description:
    "Verify your one-time password to complete sign in to Flow Merchant Platform.",
};

export default function OtpPage() {
  return <OtpPageContent />;
}
