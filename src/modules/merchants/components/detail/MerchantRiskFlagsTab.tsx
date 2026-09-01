import { SummaryCard } from "@/components/base/SummaryCard";
import { cn } from "@/lib/utils";
import {
  RISK_FLAG_STATUS_LABELS,
  RISK_FLAG_STATUS_STYLES,
} from "../../constants";
import { fetchMerchantRiskSummary } from "../../services/merchantDetailService";
import type { MerchantDetail } from "../../types";

type MerchantRiskFlagsTabProps = {
  merchant: MerchantDetail;
};

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-rose-50 text-rose-600",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

/** FE-243, FE-253 — red-flag cases raised against this merchant. */
const MerchantRiskFlagsTab = async ({
  merchant,
}: MerchantRiskFlagsTabProps) => {
  const risk = await fetchMerchantRiskSummary(merchant.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Open Flags"
          value={risk.open}
          variant={risk.open > 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="High Severity"
          value={risk.highSeverity}
          variant={risk.highSeverity > 0 ? "danger" : "default"}
        />
        <SummaryCard
          label="Under Review"
          value={risk.underReview}
          variant={risk.underReview > 0 ? "warning" : "default"}
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-xs">
        {risk.flags.length === 0 ? (
          <p className="px-6 py-20 text-center text-sm text-slate-400">
            No risk flags for this merchant
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  {[
                    "Case",
                    "Metric",
                    "Observed",
                    "Severity",
                    "Status",
                    "Detected",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {risk.flags.map((flag) => (
                  <tr
                    key={flag.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-[#7C3AED]">
                      {flag.id}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {flag.metric}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      {flag.observed}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                          SEVERITY_STYLES[flag.severity],
                        )}
                      >
                        {flag.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          RISK_FLAG_STATUS_STYLES[flag.status],
                        )}
                      >
                        {RISK_FLAG_STATUS_LABELS[flag.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                      {flag.detectedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantRiskFlagsTab;
export { MerchantRiskFlagsTab };
export type { MerchantRiskFlagsTabProps };
