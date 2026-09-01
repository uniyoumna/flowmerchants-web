import { fetchRiskFlags } from "../../services/riskFlagsService";
import type { RiskFlagsQueryParams } from "../../types";
import { RiskFlagsTableCard } from "./RiskFlagsTableCard";

type RiskFlagsTableSectionProps = {
  query: RiskFlagsQueryParams;
};

const RiskFlagsTableSection = async ({ query }: RiskFlagsTableSectionProps) => {
  const result = await fetchRiskFlags(query);

  return <RiskFlagsTableCard result={result} query={query} />;
};

export default RiskFlagsTableSection;
export { RiskFlagsTableSection };
