"use client";

import { Mail } from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";
import { BaseInput } from "@/components/base/BaseInput";
import { InputPassword } from "@/components/base/InputPassword";
import { useLoginForm } from "@/modules/auth/login/hooks/useLoginForm";

const LoginForm = () => {
  const { register, handleSubmit, errors, isSubmitting, serverError } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
      <BaseInput
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        startIcon={<Mail />}
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Password */}
      <InputPassword
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {/* Server error */}
      {serverError && (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <BaseButton
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Signing in..."
        className="h-11 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
      >
        Sign In
      </BaseButton>
    </form>
  );
};

export default LoginForm;
export { LoginForm };
