import { Suspense } from "react";
import { SettlementsReportSection } from "./SettlementsReportSection";
import { SettlementsReportSkeleton } from "./SettlementsReportSkeleton";

/**
 * The settlement report: headline totals, net payout per merchant, and the
 * spread of tickets across the lifecycle.
 *
 * Every figure is rolled up from the same tickets the settlements list renders,
 * so the two screens cannot disagree about how much money is owed.
 */
const SettlementsReportPage = () => {
  return (
    <Suspense fallback={<SettlementsReportSkeleton />}>
      <SettlementsReportSection />
    </Suspense>
  );
};

export default SettlementsReportPage;
export { SettlementsReportPage };
