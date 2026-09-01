type SettlementsTableSkeletonProps = {
  rows?: number;
};

/** Fallback while a tab loads — mirrors the card it replaces. */
const SettlementsTableSkeleton = ({
  rows = 6,
}: SettlementsTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="h-6 w-44 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="flex gap-6 border-y border-slate-100 px-6 py-3.5">
        {Array.from({ length: 7 }, (_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder has no identity
            key={index}
            className="h-4 w-16 animate-pulse rounded bg-slate-100"
          />
        ))}
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder has no identity
            key={index}
            className="flex animate-pulse items-center gap-6 px-6 py-5"
          >
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-40 rounded bg-slate-100" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-6 w-20 rounded-md bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettlementsTableSkeleton;
export { SettlementsTableSkeleton };
export type { SettlementsTableSkeletonProps };
