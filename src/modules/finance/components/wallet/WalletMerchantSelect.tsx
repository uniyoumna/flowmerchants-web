"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { WalletMerchantOption } from "../../types";
import { buildWalletHref } from "../../utils/walletQuery";

type WalletMerchantSelectProps = {
  merchants: WalletMerchantOption[];
  selectedCode: string;
};

/**
 * Picks whose wallet is on screen.
 *
 * Writes the choice to the URL and lets the server refetch, so a wallet can be
 * linked to directly and browser back moves between merchants. A native select
 * is used deliberately: on mobile it opens the platform picker, which handles a
 * long merchant list far better than a custom menu.
 */
const WalletMerchantSelect = ({
  merchants,
  selectedCode,
}: WalletMerchantSelectProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={selectedCode}
        aria-label="Select a merchant wallet"
        disabled={isPending}
        onChange={(event) => {
          const code = event.target.value;
          startTransition(() => {
            router.push(buildWalletHref(code), { scroll: false });
          });
        }}
        className="cursor-pointer appearance-none bg-transparent py-1 pr-8 text-xl font-bold text-slate-900 outline-none focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] disabled:opacity-60"
      >
        {merchants.map((merchant) => (
          <option key={merchant.merchantCode} value={merchant.merchantCode}>
            {merchant.merchantName} — {merchant.merchantCode}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-1 size-5 text-slate-500" />
    </div>
  );
};

export default WalletMerchantSelect;
export { WalletMerchantSelect };
export type { WalletMerchantSelectProps };
