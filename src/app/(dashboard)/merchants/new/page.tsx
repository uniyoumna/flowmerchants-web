import type { Metadata } from "next";
import { MerchantCreatePage } from "@/modules/merchants/components/create/MerchantCreatePage";

export const metadata: Metadata = {
  title: "Create New Merchant",
  description: "Onboard a new merchant into Flow.",
};

type NewMerchantPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewMerchantPage({
  searchParams,
}: NewMerchantPageProps) {
  return <MerchantCreatePage searchParams={await searchParams} />;
}
