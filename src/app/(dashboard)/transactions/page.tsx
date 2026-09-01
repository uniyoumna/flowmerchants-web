import type { Metadata } from "next";
import { TransactionsListPage } from "@/modules/transactions/components/list/TransactionsListPage";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Track and filter all live merchant transactions.",
};

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <TransactionsListPage scope="all" searchParams={resolvedSearchParams} />
  );
}
