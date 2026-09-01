import { SummaryCard } from "@/components/base/SummaryCard";
import { formatCurrency } from "@/utils/formatters";
import type { TransactionsOverview } from "../../types";

type TransactionsStatsGridProps = {
  overview?: TransactionsOverview;
  isLoading?: boolean;
};

/**
 * The four KPI cards. Figures are scoped to the page, so the Purchases screen
 * shows zero under Total Refunds rather than the ledger-wide figure — a card
 * contradicting the table below it would be worse than an empty one.
 */
const TransactionsStatsGrid = ({
  overview,
  isLoading = false,
}: TransactionsStatsGridProps) => {
  const blank = isLoading || !overview;

  const money = (value: number) =>
    blank ? "—" : formatCurrency(value, overview.currency);

  const count = (value: number) => (blank ? "—" : value.toLocaleString());

  const transactionsLabel = (value: number) => {
    if (blank) return undefined;
    const noun = value === 1 ? "transaction" : "transactions";
    return `${value.toLocaleString()} ${noun}`;
  };

  const cards = [
    {
      label: "Total Purchases",
      value: money(overview?.totalPurchases ?? 0),
      description: transactionsLabel(overview?.purchaseCount ?? 0),
      variant: "success" as const,
    },
    {
      label: "Total Refunds",
      value: money(overview?.totalRefunds ?? 0),
      description: transactionsLabel(overview?.refundCount ?? 0),
      variant: "danger" as const,
    },
    {
      label: "Completed",
      value: count(overview?.completed ?? 0),
      description: "Settled successfully",
      variant: "default" as const,
    },
    {
      label: "Pending",
      value: count(overview?.pending ?? 0),
      description: "Awaiting settlement",
      variant: "warning" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard
          key={card.label}
          label={card.label}
          value={card.value}
          description={card.description}
          variant={card.variant}
        />
      ))}
    </div>
  );
};

export default TransactionsStatsGrid;
export { TransactionsStatsGrid };
export type { TransactionsStatsGridProps };
