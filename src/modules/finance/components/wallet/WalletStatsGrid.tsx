import { SummaryCard } from "@/components/base/SummaryCard";
import { formatCurrency } from "@/utils/formatters";
import type { MerchantWallet } from "../../types";

type WalletStatsGridProps = {
  wallet?: MerchantWallet;
  isLoading?: boolean;
};

const WalletStatsGrid = ({
  wallet,
  isLoading = false,
}: WalletStatsGridProps) => {
  const money = (value: number) =>
    isLoading || !wallet ? "—" : formatCurrency(value, wallet.currency);

  const cards = [
    {
      label: "Wallet Balance",
      value: money(wallet?.balance ?? 0),
      description: "Current available",
      variant: "default" as const,
    },
    {
      label: "Total Income",
      value: money(wallet?.totalIncome ?? 0),
      description: "This period",
      variant: "success" as const,
    },
    {
      label: "Total Outcome",
      value: money(wallet?.totalOutcome ?? 0),
      description: "Disbursed + fees",
      variant: "danger" as const,
    },
    {
      label: "Pending Settlement",
      value: money(wallet?.pendingSettlement ?? 0),
      description: "Awaiting disbursement",
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

export default WalletStatsGrid;
export { WalletStatsGrid };
export type { WalletStatsGridProps };
