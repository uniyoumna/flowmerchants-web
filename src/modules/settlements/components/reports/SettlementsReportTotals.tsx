import { SummaryCard } from "@/components/base/SummaryCard";
import { formatCurrency } from "@/utils/formatters";
import type { SettlementsReportTotals as Totals } from "../../types";

type SettlementsReportTotalsProps = {
  totals?: Totals;
  isLoading?: boolean;
};

/** The four headline figures: what came in, what went out, and the leakage. */
const SettlementsReportTotals = ({
  totals,
  isLoading = false,
}: SettlementsReportTotalsProps) => {
  const money = (value: number) =>
    isLoading || !totals ? "—" : formatCurrency(value, totals.currency);

  const cards = [
    {
      label: "Total Gross",
      value: money(totals?.gross ?? 0),
      description: "All settlement periods",
      variant: "default" as const,
    },
    {
      label: "Net Disbursed",
      value: money(totals?.netDisbursed ?? 0),
      description: "After refunds & fees",
      variant: "success" as const,
    },
    {
      label: "Total Refunds",
      value: money(totals?.refunds ?? 0),
      description: "Charged back",
      variant: "danger" as const,
    },
    {
      label: "Fees Collected",
      value: money(totals?.fees ?? 0),
      description: "Platform commission",
      variant: "purple" as const,
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

export default SettlementsReportTotals;
export { SettlementsReportTotals };
export type { SettlementsReportTotalsProps };
