/** Fallback while the report loads — mirrors the blocks it replaces. */
const SettlementsReportSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["gross", "net", "refunds", "fees"].map((block) => (
          <div
            key={block}
            className="h-32 animate-pulse rounded-2xl bg-white shadow-xs"
          />
        ))}
      </div>

      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-xs">
        <div className="h-5 w-56 animate-pulse rounded bg-slate-100" />

        {["a", "b", "c", "d"].map((row) => (
          <div key={row} className="animate-pulse space-y-2">
            <div className="h-4 w-64 rounded bg-slate-100" />
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-72 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettlementsReportSkeleton;
export { SettlementsReportSkeleton };
