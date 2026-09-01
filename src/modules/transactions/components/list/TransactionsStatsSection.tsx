import { fetchTransactionsOverview } from "../../services/transactionsService";
import type { TransactionScope } from "../../types";
import { TransactionsStatsGrid } from "./TransactionsStatsGrid";

type TransactionsStatsSectionProps = {
  scope: TransactionScope;
};

const TransactionsStatsSection = async ({
  scope,
}: TransactionsStatsSectionProps) => {
  const overview = await fetchTransactionsOverview(scope);

  return <TransactionsStatsGrid overview={overview} />;
};

export default TransactionsStatsSection;
export { TransactionsStatsSection };
