import type { Metadata } from "next";
import { MerchantDetailPage } from "@/modules/merchants/components/detail/MerchantDetailPage";

export const metadata: Metadata = {
  title: "Merchant Details",
  description: "View and edit a single merchant.",
};

type MerchantDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MerchantDetailsPage({
  params,
  searchParams,
}: MerchantDetailsPageProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <MerchantDetailPage merchantId={id} searchParams={resolvedSearchParams} />
  );
}
