import { fetchConfigQueue } from "../../services/financeService";
import { ALL_CONFIG_STATUSES, type ConfigQueryParams } from "../../types";
import { ConfigTableCard } from "./ConfigTableCard";

type ConfigTableSectionProps = {
  query: ConfigQueryParams;
};

const ConfigTableSection = async ({ query }: ConfigTableSectionProps) => {
  const result = await fetchConfigQueue(query);
  const isFiltered =
    Boolean(query.search) || query.status !== ALL_CONFIG_STATUSES;

  return <ConfigTableCard result={result} isFiltered={isFiltered} />;
};

export default ConfigTableSection;
export { ConfigTableSection };
