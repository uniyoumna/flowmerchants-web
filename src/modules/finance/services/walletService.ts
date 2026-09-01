import { customFetch } from "@/utils/fetch";
import type {
  MerchantWallet,
  WalletLedgerEntry,
  WalletMerchantOption,
  WalletResult,
} from "../types";
import { MOCK_WALLET_LEDGER, MOCK_WALLETS } from "./walletMockData";

const WALLET_ENDPOINT = "/api/v1/finance/wallets/";

/**
 * The wallet endpoints are not deployed yet. Set this to `false` and delete
 * `walletMockData.ts` once they ship — the request code below is already
 * written, and neither the view models nor the call sites change.
 */
// TODO: flip to `false` when the wallet endpoints are deployed.
const USE_MOCK_WALLET = true;

/**
 * Share of the merchant's money that has actually settled.
 *
 * A merchant with nothing in either bucket reports 0 rather than dividing by
 * zero — an untraded wallet is not "fully utilised".
 */
export function walletUtilisation(balance: number, pending: number): number {
  const total = balance + pending;
  if (total <= 0) return 0;

  return Math.round((balance / total) * 100);
}

/** Income and outcome are summed from the ledger, never reported separately. */
function totalsFromLedger(ledger: WalletLedgerEntry[]) {
  return ledger.reduce(
    (totals, entry) => ({
      totalIncome:
        totals.totalIncome + (entry.type === "income" ? entry.amount : 0),
      totalOutcome:
        totals.totalOutcome + (entry.type === "outcome" ? entry.amount : 0),
    }),
    { totalIncome: 0, totalOutcome: 0 },
  );
}

/** Every merchant that can appear in the wallet picker. */
export async function fetchWalletMerchants(): Promise<WalletMerchantOption[]> {
  if (USE_MOCK_WALLET) {
    return MOCK_WALLETS.map(({ merchantId, merchantName, merchantCode }) => ({
      merchantId,
      merchantName,
      merchantCode,
    }));
  }

  const { data } = await customFetch.get<WalletMerchantOption[]>(
    `${WALLET_ENDPOINT}merchants/`,
    { cache: "no-store" },
  );

  return data ?? [];
}

/**
 * One merchant's wallet, plus the picker options the screen needs.
 *
 * `merchantCode` of `null` selects the first merchant, so the page always has
 * something to show rather than an empty state on first load. Never throws — a
 * failure comes back as `error`.
 */
export async function fetchMerchantWallet(
  merchantCode: string | null,
): Promise<WalletResult> {
  const merchants = await fetchWalletMerchants();

  if (USE_MOCK_WALLET) {
    const selected =
      MOCK_WALLETS.find((wallet) => wallet.merchantCode === merchantCode) ??
      MOCK_WALLETS[0];

    if (!selected) {
      return { data: null, merchants, error: null };
    }

    const ledger = MOCK_WALLET_LEDGER;

    return {
      data: {
        merchantId: selected.merchantId,
        merchantName: selected.merchantName,
        merchantCode: selected.merchantCode,
        status: selected.status,
        balance: selected.balance,
        pendingSettlement: selected.pendingSettlement,
        ...totalsFromLedger(ledger),
        utilisation: walletUtilisation(
          selected.balance,
          selected.pendingSettlement,
        ),
        currency: "EGP",
        ledger,
      },
      merchants,
      error: null,
    };
  }

  const code = merchantCode ?? merchants[0]?.merchantCode;
  if (!code) return { data: null, merchants, error: null };

  const { data, error } = await customFetch.get<MerchantWallet>(
    `${WALLET_ENDPOINT}${encodeURIComponent(code)}/`,
    { cache: "no-store" },
  );

  if (error || !data) {
    return {
      data: null,
      merchants,
      error: error ?? "Failed to load this merchant's wallet.",
    };
  }

  // Derived here rather than trusted from the payload, so the cards and the
  // ledger on screen can never disagree.
  return {
    data: {
      ...data,
      ...totalsFromLedger(data.ledger ?? []),
      utilisation: walletUtilisation(data.balance, data.pendingSettlement),
    },
    merchants,
    error: null,
  };
}
