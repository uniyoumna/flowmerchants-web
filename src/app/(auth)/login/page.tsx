import type { Metadata } from "next";
import { LoginPageContent } from "@/modules/auth/login/components/LoginPageContent";

export const metadata: Metadata = {
  title: "Sign In | Flow",
  description:
    "Sign in to Flow — the merchant lifecycle platform for acquisition and compliance teams.",
};

export default function LoginPage() {
  return <LoginPageContent />;
}
