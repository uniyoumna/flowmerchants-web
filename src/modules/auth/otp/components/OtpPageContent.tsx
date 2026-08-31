import Image from "next/image";
import logo from "@/assets/icons/logo.svg";
import { OtpForm } from "@/modules/auth/otp/components/OtpForm";

export const OtpPageContent = () => {
  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel ─── */}
      <div className="hidden w-[30%] flex-col justify-between bg-linear-to-b from-[#7C3AED] to-[#A855F7] p-10 lg:flex">
        {/* Branding */}
        <div>
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white backdrop-blur-sm">
              <Image src={logo} alt="logo" />
            </div>
            <span className="text-lg font-bold text-white">Flow</span>
          </div>

          {/* Tagline */}
          <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            Two-factor
            <br />
            verification.
          </h1>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-white/70">
            Enhanced security for your organization. Verify your identity with
            the one-time verification code.
          </p>
        </div>

        {/* Footer info in sidebar */}
        <div className="text-xs text-white/60">
          Protected by Flow Security &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Verification Code
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Please enter the 6-digit security code to access your account.
            </p>
          </div>

          {/* OTP Form */}
          <OtpForm />
        </div>
      </div>
    </div>
  );
};
