type TeamTableSkeletonProps = {
  rows?: number;
};

/** Fallback while the members load — mirrors the card it replaces. */
const TeamTableSkeleton = ({ rows = 6 }: TeamTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-xl bg-slate-100" />
        <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {Array.from({ length: rows }, (_, index) => index).map((rowIndex) => (
          <div
            key={rowIndex}
            className="flex animate-pulse items-center gap-6 px-6 py-4"
          >
            <div className="size-10 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-40 rounded bg-slate-100" />
              <div className="h-3 w-48 rounded bg-slate-100" />
            </div>
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="h-6 w-24 rounded-md bg-slate-100" />
            <div className="h-6 w-20 rounded-md bg-slate-100" />
            <div className="h-8 w-24 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTableSkeleton;
export { TeamTableSkeleton };
export type { TeamTableSkeletonProps };
