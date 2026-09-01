import { WALLET_QUERY_KEYS } from "../constants";
import type { RawSearchParams } from "./financeQuery";

/**
 * Which merchant's wallet the URL asks for.
 *
 * Returns `null` when nothing is specified so the service can fall back to the
 * first merchant — the page should never open on an empty wallet.
 */
export function parseWalletMerchantCode(
  searchParams: RawSearchParams = {},
): string | null {
  const raw = searchParams[WALLET_QUERY_KEYS.merchant];
  const value = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  return value.trim() ? value.trim() : null;
}

/** `/finance/wallet?merchant=MCH-10042`. */
export function buildWalletHref(merchantCode: string): string {
  return `/finance/wallet?${WALLET_QUERY_KEYS.merchant}=${encodeURIComponent(merchantCode)}`;
}
