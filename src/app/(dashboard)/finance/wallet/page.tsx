import type { Metadata } from "next";
import { WalletPage } from "@/modules/finance/components/wallet/WalletPage";

export const metadata: Metadata = {
  title: "Merchant Wallet",
  description: "Manage digital wallets and payout balances.",
};

type MerchantWalletRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MerchantWalletRoute({
  searchParams,
}: MerchantWalletRouteProps) {
  const resolvedSearchParams = await searchParams;

  return <WalletPage searchParams={resolvedSearchParams} />;
}
