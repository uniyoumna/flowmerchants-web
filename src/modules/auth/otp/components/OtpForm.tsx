"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";
import { OtpPinInput } from "@/modules/auth/otp/components/OtpPinInput";
import { useOtpForm } from "@/modules/auth/otp/hooks/useOtpForm";

export const OtpForm = () => {
  const {
    email,
    otpValue,
    countdown,
    canResend,
    isResending,
    serverError,
    successMessage,
    isSubmitting,
    errors,
    handlePinChange,
    handleResend,
    handleBackToLogin,
    handleSubmit,
  } = useOtpForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Email Info Badge */}
      {email && (
        <div className="flex items-center justify-between rounded-xl bg-purple-50/70 border border-purple-100 p-3.5 text-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Mail className="size-4" />
            </div>
            <div className="truncate">
              <p className="text-xs text-muted-foreground">Code sent to</p>
              <p className="font-semibold text-slate-900 truncate">{email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline shrink-0 ml-3"
          >
            Change
          </button>
        </div>
      )}

      {/* OTP Pin Input Slots */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">
          Enter 6-digit Code
        </span>
        <OtpPinInput
          value={otpValue}
          onChange={handlePinChange}
          disabled={isSubmitting}
          hasError={Boolean(errors.otp || serverError)}
        />
        {errors.otp?.message && (
          <p className="text-xs text-destructive mt-1 font-medium">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div
          className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
          role="alert"
        >
          <ShieldAlert className="size-4 shrink-0 mt-0.5" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* Success Alert (e.g. Code Resent) */}
      {successMessage && (
        <output className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </output>
      )}

      {/* Submit Action */}
      <BaseButton
        type="submit"
        fullWidth
        isLoading={isSubmitting}
        loadingText="Verifying code..."
        className="h-11 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
      >
        Verify & Sign In
      </BaseButton>

      {/* Resend & Back actions */}
      <div className="flex flex-col items-center gap-3 pt-1 text-center">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Didn&apos;t receive the code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="inline-flex items-center gap-1 font-semibold text-purple-600 hover:text-purple-700 hover:underline disabled:opacity-50"
            >
              {isResending ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : null}
              Resend Code
            </button>
          ) : (
            <span className="font-medium text-slate-500">
              Resend in {countdown}s
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mt-2"
        >
          <ArrowLeft className="size-3.5" />
          Back to Sign In
        </button>
      </div>
    </form>
  );
};
