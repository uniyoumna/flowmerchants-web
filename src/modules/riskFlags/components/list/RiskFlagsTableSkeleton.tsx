type RiskFlagsTableSkeletonProps = {
  rows?: number;
};

/** Fallback while a tab loads — mirrors the card it replaces. */
const RiskFlagsTableSkeleton = ({ rows = 4 }: RiskFlagsTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="px-6 py-5">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="flex gap-6 border-y border-slate-100 px-6 py-3.5">
        {["all", "open", "review", "resolved", "dismissed"].map((tab) => (
          <div
            key={tab}
            className="h-4 w-16 animate-pulse rounded bg-slate-100"
          />
        ))}
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => index).map((rowIndex) => (
          <div
            key={rowIndex}
            className="flex animate-pulse items-center gap-6 px-6 py-6"
          >
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-40 rounded bg-slate-100" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="h-6 w-16 rounded-md bg-slate-100" />
            <div className="h-6 w-24 rounded-md bg-slate-100" />
            <div className="h-8 w-32 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskFlagsTableSkeleton;
export { RiskFlagsTableSkeleton };
export type { RiskFlagsTableSkeletonProps };
