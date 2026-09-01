import { fetchMerchantWallet } from "../../services/walletService";
import { WalletLedgerCard } from "./WalletLedgerCard";
import { WalletMerchantSelect } from "./WalletMerchantSelect";
import { WalletPerformanceCard } from "./WalletPerformanceCard";
import { WalletStatsGrid } from "./WalletStatsGrid";
import { WalletStatusBadge } from "./WalletStatusBadge";

type WalletSectionProps = {
  merchantCode: string | null;
};

const WalletSection = async ({ merchantCode }: WalletSectionProps) => {
  const {
    data: wallet,
    merchants,
    error,
  } = await fetchMerchantWallet(merchantCode);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
        <p className="text-sm font-semibold text-rose-700">
          Could not load this wallet
        </p>
        <p className="mt-1 text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white px-6 py-16 text-center shadow-xs">
        <p className="text-sm font-semibold text-slate-700">
          No merchant wallets yet
        </p>
        <p className="mt-1 text-sm text-slate-500">
          A wallet is created once a merchant is approved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── 1. Who this wallet belongs to, and whether it can move money ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-xs">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Wallet for
          </p>

          <WalletMerchantSelect
            merchants={merchants}
            selectedCode={wallet.merchantCode}
          />
        </div>

        <WalletStatusBadge status={wallet.status} />
      </div>

      {/* ─── 2. Money at a glance ─── */}
      <WalletStatsGrid wallet={wallet} />

      {/* ─── 3. How much of it has settled ─── */}
      <WalletPerformanceCard utilisation={wallet.utilisation} />

      {/* ─── 4. The movements behind those totals ─── */}
      <WalletLedgerCard ledger={wallet.ledger} currency={wallet.currency} />
    </div>
  );
};

export default WalletSection;
export { WalletSection };
