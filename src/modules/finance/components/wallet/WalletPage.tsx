import { Suspense } from "react";
import type { RawSearchParams } from "../../utils/financeQuery";
import { parseWalletMerchantCode } from "../../utils/walletQuery";
import { WalletSection } from "./WalletSection";
import { WalletSkeleton } from "./WalletSkeleton";

type WalletPageProps = {
  searchParams?: RawSearchParams;
};

/**
 * One merchant's wallet at a time.
 *
 * The selected merchant lives in the URL and the server refetches, so a wallet
 * can be linked to directly and browser back moves between merchants. With no
 * merchant in the URL the service falls back to the first one, so the page
 * never opens empty.
 */
const WalletPage = ({ searchParams }: WalletPageProps) => {
  const merchantCode = parseWalletMerchantCode(searchParams);

  return (
    // Keyed on the merchant so switching shows the skeleton rather than the
    // previous merchant's balances.
    <Suspense key={merchantCode ?? "default"} fallback={<WalletSkeleton />}>
      <WalletSection merchantCode={merchantCode} />
    </Suspense>
  );
};

export default WalletPage;
export { WalletPage };
export type { WalletPageProps };
