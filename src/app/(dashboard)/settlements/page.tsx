import type { Metadata } from "next";
import { SettlementsListPage } from "@/modules/settlements/components/list/SettlementsListPage";

export const metadata: Metadata = {
  title: "List of Settlements",
  description: "Monitor and reconcile merchant settlement batches.",
};

type SettlementsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettlementsPage({
  searchParams,
}: SettlementsPageProps) {
  const resolvedSearchParams = await searchParams;

  return <SettlementsListPage searchParams={resolvedSearchParams} />;
}
