import type { Metadata } from "next";
import { MerchantsListPage } from "@/modules/merchants/components/list/MerchantsListPage";

export const metadata: Metadata = {
  title: "Merchants List",
  description: "Search, filter and manage the merchant acquisition worklist.",
};

type MerchantsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MerchantsPage({
  searchParams,
}: MerchantsPageProps) {
  return <MerchantsListPage searchParams={await searchParams} />;
}
