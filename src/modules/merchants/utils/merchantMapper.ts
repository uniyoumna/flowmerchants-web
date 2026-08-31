import { ALL_STATUSES, type ApiMerchant, type Merchant } from "../types";

/** Placeholder the table shows for a value the backend has not supplied. */
const EMPTY = "—";

/** `2026-08-31T09:49:49.565Z` → `2026-08-31` (the table renders dates only). */
function toDateOnly(value: string | null | undefined): string | null {
  if (!value) return null;
  const [datePart] = value.split("T");
  return datePart || null;
}

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** The "Branches" column reads as `active/max`, e.g. `12/15`. */
function formatBranches(merchant: ApiMerchant): string {
  const { active_branches: active, max_branches: max } = merchant;

  if (typeof active === "number" && typeof max === "number") {
    return `${active}/${max}`;
  }

  if (typeof max === "number") return `${EMPTY}/${max}`;

  return EMPTY;
}

/** Maps one API row onto the shape the merchants table renders. */
export function mapApiMerchant(apiMerchant: ApiMerchant): Merchant {
  const products =
    apiMerchant.assigned_products
      ?.filter((product) => product.is_active !== false)
      .map((product) => product.product_name)
      .filter(Boolean) ?? [];

  return {
    id: apiMerchant.id,
    name: apiMerchant.name_en,
    arabicName: apiMerchant.name_ar,
    code: nonEmpty(apiMerchant.commercial_registration_number),
    products: products.length > 0 ? products : null,
    businessType: nonEmpty(apiMerchant.business_type) ?? EMPTY,
    owner: nonEmpty(apiMerchant.acquisition_owner_name) ?? EMPTY,
    branches: formatBranches(apiMerchant),
    expiry: toDateOnly(apiMerchant.approval_expiry_date),
    joiningDate: toDateOnly(apiMerchant.created_at) ?? EMPTY,
    status: apiMerchant.status,
  };
}

/** Drops the `"all"` sentinel so the `status` param is omitted entirely. */
export function toStatusParam(
  status: Merchant["status"] | typeof ALL_STATUSES,
): string | undefined {
  return status === ALL_STATUSES ? undefined : status;
}
