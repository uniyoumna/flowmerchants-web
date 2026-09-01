import type { Metadata } from "next";
import { TransactionsListPage } from "@/modules/transactions/components/list/TransactionsListPage";

export const metadata: Metadata = {
  title: "Purchases",
  description: "Track and filter merchant purchase transactions.",
};

type PurchasesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PurchasesPage({
  searchParams,
}: PurchasesPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <TransactionsListPage
      scope="purchase"
      searchParams={resolvedSearchParams}
    />
  );
}
