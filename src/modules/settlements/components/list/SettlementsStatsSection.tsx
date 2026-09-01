import { fetchSettlementsOverview } from "../../services/settlementsService";
import { SettlementsStatsGrid } from "./SettlementsStatsGrid";

const SettlementsStatsSection = async () => {
  const overview = await fetchSettlementsOverview();

  return <SettlementsStatsGrid overview={overview} />;
};

export default SettlementsStatsSection;
export { SettlementsStatsSection };
