/** Fallback while a tab's data loads — mirrors the panel it replaces. */
const MerchantDetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-2xl bg-white shadow-xs" />
        <div className="h-28 rounded-2xl bg-white shadow-xs" />
        <div className="h-28 rounded-2xl bg-white shadow-xs" />
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-xs">
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  );
};

export default MerchantDetailSkeleton;
export { MerchantDetailSkeleton };
