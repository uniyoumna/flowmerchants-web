/** Fallback while a step's saved data is fetched — mirrors the real card. */
const MerchantStepSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
      <div className="h-5 w-40 rounded bg-slate-100" />
      <div className="h-40 rounded-xl bg-slate-100" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
      </div>

      <div className="h-5 w-32 rounded bg-slate-100" />
      <div className="h-11 rounded-lg bg-slate-100" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
};

export default MerchantStepSkeleton;
export { MerchantStepSkeleton };
