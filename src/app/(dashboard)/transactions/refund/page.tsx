import type { Metadata } from "next";
import { TransactionsListPage } from "@/modules/transactions/components/list/TransactionsListPage";

export const metadata: Metadata = {
  title: "Refunds",
  description: "Track and filter merchant refund transactions.",
};

type RefundPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RefundPage({ searchParams }: RefundPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <TransactionsListPage scope="refund" searchParams={resolvedSearchParams} />
  );
}
