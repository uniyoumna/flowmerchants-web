type WalletPerformanceCardProps = {
  /** Whole percent, 0–100. */
  utilisation: number;
};

/**
 * How much of the merchant's money has actually settled.
 *
 * The formula is printed under the bar because "75%" alone is ambiguous —
 * a finance operator needs to know it is settled over settled-plus-pending,
 * not a share of some target.
 */
const WalletPerformanceCard = ({ utilisation }: WalletPerformanceCardProps) => {
  const clamped = Math.min(100, Math.max(0, utilisation));

  return (
    <section className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Account Performance
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Wallet utilisation ratio
          </p>
        </div>

        <p className="text-2xl font-bold text-slate-900">{clamped}%</p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Wallet utilisation"
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-[#4C1D95] to-[#A855F7]"
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
        <span>0%</span>
        <span>Settled / (Settled + Pending)</span>
        <span>100%</span>
      </div>
    </section>
  );
};

export default WalletPerformanceCard;
export { WalletPerformanceCard };
export type { WalletPerformanceCardProps };
