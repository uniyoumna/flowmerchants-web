import { fetchMerchants } from "../../services/merchantsService";
import { ALL_STATUSES, type MerchantsQueryParams } from "../../types";
import { MerchantsTableCard } from "./MerchantsTableCard";

type MerchantsTableSectionProps = {
  query: MerchantsQueryParams;
};

const MerchantsTableSection = async ({ query }: MerchantsTableSectionProps) => {
  const result = await fetchMerchants(query);

  const isFiltered = Boolean(
    query.search || query.status !== ALL_STATUSES || query.ordering,
  );

  return <MerchantsTableCard result={result} isFiltered={isFiltered} />;
};

export default MerchantsTableSection;
export { MerchantsTableSection };
