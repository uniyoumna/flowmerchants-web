import { fetchSettlementsReport } from "../../services/settlementsService";
import { SettlementsByMerchantCard } from "./SettlementsByMerchantCard";
import { SettlementsReportLoadError } from "./SettlementsReportLoadError";
import { SettlementsReportTotals } from "./SettlementsReportTotals";
import { SettlementsStatusBreakdownCard } from "./SettlementsStatusBreakdownCard";

const SettlementsReportSection = async () => {
  const report = await fetchSettlementsReport();

  if (report.error) {
    return <SettlementsReportLoadError message={report.error} />;
  }

  const { currency } = report.totals;

  return (
    <div className="space-y-6">
      {/* ─── 1. Headline totals ─── */}
      <SettlementsReportTotals totals={report.totals} />

      {/* ─── 2. Who was paid, and how much ─── */}
      <SettlementsByMerchantCard
        merchants={report.byMerchant}
        currency={currency}
      />

      {/* ─── 3. Where the tickets currently sit ─── */}
      <SettlementsStatusBreakdownCard
        statuses={report.byStatus}
        currency={currency}
      />
    </div>
  );
};

export default SettlementsReportSection;
export { SettlementsReportSection };
