import type { AuthUser, UserRole } from "@/modules/auth/constants/users";

// ─── Login ───────────────────────────────────────────────────────────────────

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
};

export type { LoginPayload, LoginResponse, UserRole, AuthUser };
