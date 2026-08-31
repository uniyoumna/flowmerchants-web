import type { AuthUser, LoginCredentials } from "@/modules/auth/types";

export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingCredentials: LoginCredentials | null;
  setPendingCredentials: (credentials: LoginCredentials | null) => void;
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (
    otp: string,
  ) => Promise<{ success: boolean; message?: string; defaultRoute?: string }>;
  resendOtp: () => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
};
