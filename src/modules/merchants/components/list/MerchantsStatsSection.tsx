import { fetchMerchantsOverview } from "../../services/merchantsService";
import { MerchantsStatsGrid } from "./MerchantsStatsGrid";

const MerchantsStatsSection = async () => {
  const overview = await fetchMerchantsOverview();

  return <MerchantsStatsGrid overview={overview} />;
};

export default MerchantsStatsSection;
export { MerchantsStatsSection };
