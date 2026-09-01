import { fetchComplianceOverview } from "../../services/complianceService";
import { ComplianceStatsGrid } from "./ComplianceStatsGrid";

const ComplianceStatsSection = async () => {
  const overview = await fetchComplianceOverview();

  return <ComplianceStatsGrid overview={overview} />;
};

export default ComplianceStatsSection;
export { ComplianceStatsSection };
