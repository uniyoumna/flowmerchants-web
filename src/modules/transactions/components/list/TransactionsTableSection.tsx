import { fetchTransactions } from "../../services/transactionsService";
import type { TransactionsQueryParams } from "../../types";
import { TransactionsTableCard } from "./TransactionsTableCard";

type TransactionsTableSectionProps = {
  query: TransactionsQueryParams;
};

const TransactionsTableSection = async ({
  query,
}: TransactionsTableSectionProps) => {
  const result = await fetchTransactions(query);

  return <TransactionsTableCard result={result} query={query} />;
};

export default TransactionsTableSection;
export { TransactionsTableSection };
