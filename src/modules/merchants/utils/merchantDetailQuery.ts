import { MERCHANT_DETAIL_QUERY_KEYS } from "../constants";
import {
  isMerchantDetailTab,
  MERCHANT_DETAIL_TABS,
  type MerchantDetailTab,
} from "../types";
import type { RawSearchParams } from "./merchantsQuery";

/** Route of one merchant's detail screen. */
export function merchantDetailPath(merchantId: string): string {
  return `/merchants/${encodeURIComponent(merchantId)}`;
}

/** Reads the active tab out of the URL, defaulting to Overview. */
export function parseMerchantDetailTab(
  searchParams: RawSearchParams = {},
): MerchantDetailTab {
  const raw = searchParams[MERCHANT_DETAIL_QUERY_KEYS.tab];
  const value = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  return isMerchantDetailTab(value) ? value : MERCHANT_DETAIL_TABS[0];
}

/** `/merchants/MCH-1?tab=financials` — Overview stays on the bare path. */
export function buildMerchantDetailHref(
  merchantId: string,
  tab: MerchantDetailTab,
): string {
  const path = merchantDetailPath(merchantId);
  if (tab === MERCHANT_DETAIL_TABS[0]) return path;

  return `${path}?${MERCHANT_DETAIL_QUERY_KEYS.tab}=${tab}`;
}
