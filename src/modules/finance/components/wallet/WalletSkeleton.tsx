/** Fallback while a wallet loads — mirrors the blocks it replaces. */
const WalletSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["balance", "income", "outcome", "pending"].map((block) => (
          <div
            key={block}
            className="h-32 animate-pulse rounded-2xl bg-white shadow-xs"
          />
        ))}
      </div>

      <div className="h-32 animate-pulse rounded-2xl bg-white shadow-xs" />
      <div className="h-80 animate-pulse rounded-2xl bg-white shadow-xs" />
    </div>
  );
};

export default WalletSkeleton;
export { WalletSkeleton };
