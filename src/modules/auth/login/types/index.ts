export type { LoginCredentials as LoginPayload } from "@/modules/auth/types";
export * from "@/modules/auth/types";

export interface LoginResponse {
  access: string;
  refresh: string;
}
