import { initialsOf } from "@/utils/formatters";
import type {
  ApiMerchantDetail,
  MerchantDetail,
  MerchantTeamMember,
} from "../types";

/** Placeholder for a value the backend has not supplied. */
const EMPTY = "—";

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** `2026-08-31T09:49:49.565Z` → `2026-08-31` */
function toDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const [datePart] = value.split("T");
  return datePart || null;
}

/** Amounts may arrive as numbers or as DRF decimal strings. */
function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function teamMember(
  name: string | null | undefined,
  role: string,
): MerchantTeamMember | null {
  const clean = nonEmpty(name);
  if (!clean) return null;

  return { name: clean, role, initials: initialsOf(clean) };
}

/** One merchant record → the shape the detail screen renders. */
export function mapApiMerchantDetail(api: ApiMerchantDetail): MerchantDetail {
  const name = api.name_en?.trim() || EMPTY;

  const products =
    api.assigned_products
      ?.filter((product) => product.is_active !== false)
      .map((product) => product.product_name)
      .filter(Boolean) ?? [];

  const team = [
    teamMember(api.acquisition_owner_name, "Acquisition Officer"),
    teamMember(api.compliance_owner_name, "Compliance Officer"),
  ].filter((member): member is MerchantTeamMember => member !== null);

  return {
    id: api.id,
    code: nonEmpty(api.merchant_code) ?? api.id,
    name,
    arabicName: api.name_ar?.trim() ?? "",
    initials: initialsOf(name),
    status: api.status,
    registrationNumber: nonEmpty(api.commercial_registration_number),
    businessType: nonEmpty(api.business_type) ?? EMPTY,
    products,
    activeBranches: api.active_branches ?? 0,
    maxBranches: api.max_branches ?? null,
    contractExpiry: toDateOnly(api.approval_expiry_date),
    renewalState: nonEmpty(api.renewal_state) ?? "N/A",
    walletBalance: toNumber(api.wallet_balance),
    pendingSettlement: toNumber(api.pending_settlement),
    totalPurchases: toNumber(api.total_purchases),
    currency: nonEmpty(api.currency) ?? "EGP",
    team,
  };
}
