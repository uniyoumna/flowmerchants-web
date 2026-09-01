type ConfigTableSkeletonProps = {
  rows?: number;
};

/** Fallback while a queue page loads — mirrors the card it replaces. */
const ConfigTableSkeleton = ({ rows = 4 }: ConfigTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => index).map((rowIndex) => (
          <div
            key={rowIndex}
            className="flex animate-pulse items-center gap-6 px-6 py-5"
          >
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-48 rounded bg-slate-100" />
              <div className="h-3 w-36 rounded bg-slate-100" />
            </div>
            <div className="h-1.5 w-24 rounded-full bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-6 w-24 rounded-md bg-slate-100" />
            <div className="h-8 w-20 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigTableSkeleton;
export { ConfigTableSkeleton };
export type { ConfigTableSkeletonProps };
