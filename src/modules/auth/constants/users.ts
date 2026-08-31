/**
 * Roles the UI understands. `unknown` is the deny-by-default bucket for a user
 * whose backend role we cannot map — it grants no nav items and no landing page
 * beyond the sign-in screen.
 */
export type UserRole =
  | "super_admin"
  | "merchant_acquisition"
  | "compliance"
  | "finance"
  | "unknown";
