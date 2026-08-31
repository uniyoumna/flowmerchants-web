"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/context/AuthContext";
import {
  type OtpFormValues,
  otpSchema,
} from "@/modules/auth/otp/schemas/otpSchema";
import { tokenStorage } from "@/modules/auth/utils/tokenStorage";

const RESEND_COOLDOWN_SECONDS = 60;

export function useOtpForm() {
  const router = useRouter();
  const { pendingCredentials, verifyOtp, resendOtp, setPendingCredentials } =
    useAuth();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(RESEND_COOLDOWN_SECONDS);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  // Active email being authenticated
  const email =
    pendingCredentials?.email ||
    tokenStorage.getPendingCredentials()?.email ||
    "";

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = form.watch("otp");

  // Timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle submit
  const onSubmit = useCallback(
    async (data: OtpFormValues) => {
      setServerError(null);
      setSuccessMessage(null);

      const result = await verifyOtp(data.otp);

      if (!result.success) {
        const errorMsg = result.message ?? "Invalid verification code";
        setServerError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success("Welcome back! Signed in successfully.");
      // Redirect user to their landing page
      router.push(result.defaultRoute ?? "/merchants");
    },
    [verifyOtp, router],
  );

  // Handle Resend OTP
  const handleResend = useCallback(async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const result = await resendOtp();

      if (result.success) {
        const msg =
          result.message || "A fresh verification code has been sent.";
        setSuccessMessage(msg);
        toast.success(msg);
        setCountdown(RESEND_COOLDOWN_SECONDS);
        setCanResend(false);
        form.setValue("otp", "");
      } else {
        const errorMsg =
          result.message || "Failed to resend verification code.";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
    }
  }, [canResend, isResending, resendOtp, form]);

  // Change Email / Back to Login
  const handleBackToLogin = useCallback(() => {
    setPendingCredentials(null);
    tokenStorage.clearPendingCredentials();
    router.push("/login");
  }, [setPendingCredentials, router]);

  // Auto-submit when 6 digits are reached
  const handlePinChange = useCallback(
    (val: string) => {
      form.setValue("otp", val, { shouldValidate: val.length === 6 });
      if (val.length === 6) {
        form.handleSubmit(onSubmit)();
      }
    },
    [form, onSubmit],
  );

  return {
    email,
    otpValue,
    countdown,
    canResend,
    isResending,
    serverError,
    successMessage,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    handlePinChange,
    handleResend,
    handleBackToLogin,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
