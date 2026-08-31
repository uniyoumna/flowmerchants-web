import type { UserRole } from "@/modules/auth/constants/users";

export type { UserRole };

// ─── API User Response (from GET /api/auth/me) ──────────────────────────────
export interface ApiUserResponse {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  merchant_role: string | null;
  merchant_id: string | null;
}

// ─── JWT Tokens ─────────────────────────────────────────────────────────────
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh?: string;
}

export interface DecodedJwtPayload {
  token_type?: string;
  exp?: number;
  iat?: number;
  jti?: string;
  user_id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

// ─── Request Payloads ───────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface VerifyOtpPayload extends LoginCredentials {
  otp: string;
}

// ─── UI Auth User Model ─────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
  defaultRoute: string;
  isStaff: boolean;
  isSuperuser: boolean;
  merchantRole: string | null;
  merchantId: string | null;
}

// ─── Mapper Utility ─────────────────────────────────────────────────────────
export function mapApiUserToAuthUser(apiUser: ApiUserResponse): AuthUser {
  const fullName =
    `${apiUser.first_name || ""} ${apiUser.last_name || ""}`.trim();

  const displayName =
    fullName || apiUser.username || apiUser.email.split("@")[0] || "User";

  const initials =
    apiUser.first_name && apiUser.last_name
      ? `${apiUser.first_name[0]}${apiUser.last_name[0]}`.toUpperCase()
      : displayName.slice(0, 2).toUpperCase();

  let role: UserRole = "super_admin";
  let roleLabel = "Super Admin";
  let defaultRoute = "/merchants";

  if (apiUser.is_superuser || apiUser.is_staff) {
    role = "super_admin";
    roleLabel = "Super Admin";
    defaultRoute = "/merchants";
  } else if (apiUser.merchant_role === "compliance") {
    role = "compliance";
    roleLabel = "Compliance Officer";
    defaultRoute = "/merchants/compliance";
  } else if (apiUser.merchant_role === "finance") {
    role = "finance";
    roleLabel = "Flow Finance Officer";
    defaultRoute = "/settlements";
  } else if (
    apiUser.merchant_role === "merchant_acquisition" ||
    apiUser.is_staff
  ) {
    role = "merchant_acquisition";
    roleLabel = "Merchant Acquisition Officer";
    defaultRoute = "/merchants";
  }

  return {
    id: String(apiUser.id),
    name: displayName,
    email: apiUser.email,
    username: apiUser.username,
    role,
    roleLabel,
    initials,
    defaultRoute,
    isStaff: apiUser.is_staff,
    isSuperuser: apiUser.is_superuser,
    merchantRole: apiUser.merchant_role,
    merchantId: apiUser.merchant_id,
  };
}
