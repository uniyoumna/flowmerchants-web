"use server";

import { authService } from "@/modules/auth/services/authService";
import {
  type AuthUser,
  type LoginCredentials,
  mapApiUserToAuthUser,
  type VerifyOtpPayload,
} from "@/modules/auth/types";
import { serverTokenStorage } from "@/modules/auth/utils/serverTokenStorage";

/**
 * Phase 1 Server Action: Validate credentials & dispatch OTP email server-to-server
 */
export async function requestOtpAction(
  credentials: LoginCredentials,
): Promise<{ success: boolean; message?: string }> {
  const { error } = await authService.requestOtp(credentials);

  if (error) {
    return {
      success: false,
      message: error || "Invalid email or password.",
    };
  }

  return {
    success: true,
  };
}

/**
 * Phase 2 Server Action: Verify OTP, issue tokens, and persist user cookies on the server
 */
export async function verifyOtpAction(payload: VerifyOtpPayload): Promise<{
  success: boolean;
  message?: string;
  user?: AuthUser;
  defaultRoute?: string;
}> {
  // 1. Authenticate with OTP server-to-server
  const { data: tokens, error: tokenError } = await authService.loginWithOtp(
    { email: payload.email, password: payload.password },
    payload.otp,
  );

  if (tokenError || !tokens?.access) {
    return {
      success: false,
      message: tokenError || "Invalid or expired verification code.",
    };
  }

  // 2. Set tokens in server cookies
  await serverTokenStorage.setTokens(tokens);

  // 3. Fetch authenticated user profile
  const { data: apiUser, error: userError } = await authService.getCurrentUser(
    tokens.access,
  );

  if (userError || !apiUser) {
    return {
      success: false,
      message: userError || "Failed to load user profile.",
    };
  }

  // 4. Map to domain user and store in server cookies
  const domainUser = mapApiUserToAuthUser(apiUser);
  await serverTokenStorage.setUser(domainUser);

  return {
    success: true,
    user: domainUser,
    defaultRoute: domainUser.defaultRoute || "/merchants",
  };
}

/**
 * Server Action: Silent Token Renewal
 */
export async function refreshSessionAction(): Promise<{
  success: boolean;
  user?: AuthUser;
}> {
  const refreshToken = await serverTokenStorage.getRefreshToken();

  if (!refreshToken) {
    return { success: false };
  }

  const { data: refreshData } = await authService.refreshToken(refreshToken);

  if (!refreshData?.access) {
    await serverTokenStorage.clearTokens();
    return { success: false };
  }

  await serverTokenStorage.setAccessToken(refreshData.access);

  const { data: apiUser } = await authService.getCurrentUser(
    refreshData.access,
  );

  if (!apiUser) {
    return { success: false };
  }

  const domainUser = mapApiUserToAuthUser(apiUser);
  await serverTokenStorage.setUser(domainUser);

  return {
    success: true,
    user: domainUser,
  };
}

/**
 * Server Action: Retrieve Current User Profile
 */
export async function getCurrentUserAction(): Promise<{
  user: AuthUser | null;
}> {
  const accessToken = await serverTokenStorage.getAccessToken();

  if (!accessToken) {
    const cached = await serverTokenStorage.getUser();
    return { user: cached };
  }

  const { data: apiUser } = await authService.getCurrentUser(accessToken);

  if (apiUser) {
    const domainUser = mapApiUserToAuthUser(apiUser);
    await serverTokenStorage.setUser(domainUser);
    return { user: domainUser };
  }

  // Attempt silent refresh if access token expired
  const refreshResult = await refreshSessionAction();

  if (refreshResult.success && refreshResult.user) {
    return { user: refreshResult.user };
  }

  return { user: null };
}

/**
 * Server Action: Logout and revoke tokens
 */
export async function logoutAction(): Promise<void> {
  const refreshToken = await serverTokenStorage.getRefreshToken();
  if (refreshToken) {
    await authService.blacklistToken(refreshToken);
  }
  await serverTokenStorage.clearTokens();
}
