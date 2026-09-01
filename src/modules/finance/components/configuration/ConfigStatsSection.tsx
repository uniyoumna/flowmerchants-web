import { fetchConfigOverview } from "../../services/financeService";
import { ConfigStatsGrid } from "./ConfigStatsGrid";

const ConfigStatsSection = async () => {
  const overview = await fetchConfigOverview();

  return <ConfigStatsGrid overview={overview} />;
};

export default ConfigStatsSection;
export { ConfigStatsSection };
