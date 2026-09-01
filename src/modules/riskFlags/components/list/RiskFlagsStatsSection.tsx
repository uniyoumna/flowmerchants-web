import { fetchRiskFlagsOverview } from "../../services/riskFlagsService";
import { RiskFlagsStatsGrid } from "./RiskFlagsStatsGrid";

const RiskFlagsStatsSection = async () => {
  const overview = await fetchRiskFlagsOverview();

  return <RiskFlagsStatsGrid overview={overview} />;
};

export default RiskFlagsStatsSection;
export { RiskFlagsStatsSection };
