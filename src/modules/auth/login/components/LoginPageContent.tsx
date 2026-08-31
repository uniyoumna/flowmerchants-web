import Image from "next/image";
import logo from "@/assets/icons/logo.svg";
import { LoginForm } from "@/modules/auth/login/components/LoginForm";

const LoginPageContent = () => {
  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel ─── */}
      <div className="hidden w-[30%] flex-col justify-between bg-linear-to-b from-[#7C3AED] to-[#A855F7] p-10 lg:flex">
        {/* Branding */}
        <div>
          {/* Logo placeholder */}
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white backdrop-blur-sm">
              <Image src={logo} alt="logo" />
            </div>
            <span className="text-lg font-bold text-white">Flow</span>
          </div>

          {/* Tagline */}
          <h1 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
            Merchant lifecycle,
            <br />
            end to end.
          </h1>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-white/70">
            Onboard, monitor, and settle — all from one platform built for
            acquisition and compliance teams.
          </p>
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to continue.
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPageContent;
