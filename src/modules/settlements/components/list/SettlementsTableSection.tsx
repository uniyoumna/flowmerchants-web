import { fetchSettlements } from "../../services/settlementsService";
import type { SettlementsQueryParams } from "../../types";
import { SettlementsTableCard } from "./SettlementsTableCard";

type SettlementsTableSectionProps = {
  query: SettlementsQueryParams;
};

const SettlementsTableSection = async ({
  query,
}: SettlementsTableSectionProps) => {
  const result = await fetchSettlements(query);

  return <SettlementsTableCard result={result} query={query} />;
};

export default SettlementsTableSection;
export { SettlementsTableSection };
