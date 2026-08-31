import { Package } from "lucide-react";

type MerchantsTableSkeletonProps = {
  rows?: number;
};

/** Suspense fallback for the merchants table while the server refetches. */
const MerchantsTableSkeleton = ({ rows = 10 }: MerchantsTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
            <Package className="size-4.5" />
          </div>
          <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => index).map((index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            <div className="h-3 flex-2 animate-pulse rounded bg-slate-100" />
            <div className="h-3 flex-1 animate-pulse rounded bg-slate-100" />
            <div className="h-3 flex-1 animate-pulse rounded bg-slate-100" />
            <div className="h-3 flex-1 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
        <div className="h-3 w-44 animate-pulse rounded bg-slate-100" />
        <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  );
};

export default MerchantsTableSkeleton;
export { MerchantsTableSkeleton };
