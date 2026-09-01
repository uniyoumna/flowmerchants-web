import { fetchComplianceQueue } from "../../services/complianceService";
import { ALL_STATUSES, type ComplianceQueryParams } from "../../types";
import { ComplianceTableCard } from "./ComplianceTableCard";

type ComplianceTableSectionProps = {
  query: ComplianceQueryParams;
};

const ComplianceTableSection = async ({
  query,
}: ComplianceTableSectionProps) => {
  const result = await fetchComplianceQueue(query);
  const isFiltered = Boolean(query.search) || query.status !== ALL_STATUSES;

  return <ComplianceTableCard result={result} isFiltered={isFiltered} />;
};

export default ComplianceTableSection;
export { ComplianceTableSection };
