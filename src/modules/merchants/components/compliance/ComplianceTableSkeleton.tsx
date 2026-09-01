type ComplianceTableSkeletonProps = {
  rows?: number;
};

/** Fallback while a queue page loads — mirrors the card it replaces. */
const ComplianceTableSkeleton = ({
  rows = 5,
}: ComplianceTableSkeletonProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="h-5 w-44 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }, (_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows have no identity
            key={index}
            className="flex animate-pulse items-center gap-4 px-5 py-4"
          >
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-48 rounded bg-slate-100" />
              <div className="h-3 w-32 rounded bg-slate-100" />
            </div>
            <div className="h-1.5 w-24 rounded-full bg-slate-100" />
            <div className="h-3 w-24 rounded bg-slate-100" />
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="h-8 w-20 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceTableSkeleton;
export { ComplianceTableSkeleton };
export type { ComplianceTableSkeletonProps };
