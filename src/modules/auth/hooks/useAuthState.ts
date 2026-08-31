"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  getCurrentUserAction,
  logoutAction,
  requestOtpAction,
  verifyOtpAction,
} from "@/modules/auth/actions/authActions";
import type { AuthContextType } from "@/modules/auth/context/types";
import type { AuthUser, LoginCredentials } from "@/modules/auth/types";
import { tokenStorage } from "@/modules/auth/utils/tokenStorage";

export function useAuthState(): AuthContextType {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [pendingCredentials, setPendingCredentials] =
    useState<LoginCredentials | null>(null);

  // Hydrate user and session on mount
  useEffect(() => {
    let isMounted = true;

    async function hydrateAuth() {
      // Restore cached profile from the (non-secret) cookie for instant UI
      const cachedUser = tokenStorage.getUser();
      if (cachedUser?.email && isMounted) {
        setUser(cachedUser);
        setIsAuthenticated(true);
      }

      // Validate session and retrieve profile via Next.js Server Action
      const { user: serverUser } = await getCurrentUserAction();

      if (!isMounted) return;

      if (serverUser) {
        setUser(serverUser);
        setIsAuthenticated(true);
      } else if (!cachedUser) {
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    }

    hydrateAuth().catch(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Phase 1: Request OTP code via Next.js Server Action
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    const cleanEmail = credentials.email.trim();
    const cleanPassword = credentials.password;

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        message: "Please enter both email and password.",
      };
    }

    const result = await requestOtpAction({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid email or password.",
      };
    }

    setPendingCredentials({ email: cleanEmail, password: cleanPassword });

    return {
      success: true,
    };
  }, []);

  /**
   * Phase 2: Verify OTP code via Next.js Server Action
   */
  const verifyOtp = useCallback(
    async (otp: string) => {
      if (!pendingCredentials?.email || !pendingCredentials?.password) {
        return {
          success: false,
          message:
            "Session expired or credentials missing. Please sign in again.",
        };
      }

      const cleanOtp = otp.trim();
      if (!cleanOtp || cleanOtp.length < 4) {
        return {
          success: false,
          message: "Please enter a valid OTP code.",
        };
      }

      const result = await verifyOtpAction({
        email: pendingCredentials.email,
        password: pendingCredentials.password,
        otp: cleanOtp,
      });

      if (!result.success || !result.user) {
        return {
          success: false,
          message: result.message || "Invalid OTP code. Please try again.",
        };
      }

      setUser(result.user);
      setIsAuthenticated(true);
      setPendingCredentials(null);

      return {
        success: true,
        defaultRoute: result.defaultRoute || "/merchants",
      };
    },
    [pendingCredentials],
  );

  /**
   * Resend OTP verification code
   */
  const resendOtp = useCallback(async () => {
    if (!pendingCredentials?.email || !pendingCredentials?.password) {
      return {
        success: false,
        message: "No active login session found. Please sign in again.",
      };
    }

    const result = await requestOtpAction(pendingCredentials);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to resend verification code.",
      };
    }

    return {
      success: true,
      message: "A fresh verification code has been sent to your email.",
    };
  }, [pendingCredentials]);

  /**
   * Logout user and revoke tokens
   */
  const logout = useCallback(async () => {
    await logoutAction();

    setPendingCredentials(null);
    setIsAuthenticated(false);
    setUser(null);

    toast.info("Signed out successfully.");
    router.push("/login");
  }, [router]);

  return useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      pendingCredentials,
      setPendingCredentials,
      login,
      verifyOtp,
      resendOtp,
      logout,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      pendingCredentials,
      login,
      verifyOtp,
      resendOtp,
      logout,
    ],
  );
}
