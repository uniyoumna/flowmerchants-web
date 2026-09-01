import type { Metadata } from "next";
import { MerchantConfigPage } from "@/modules/finance/components/review/MerchantConfigPage";

export const metadata: Metadata = {
  title: "Merchant Configuration",
  description: "Set the financial parameters for one merchant.",
};

type ConfigReviewRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ConfigReviewRoute({
  params,
}: ConfigReviewRouteProps) {
  const { id } = await params;

  return <MerchantConfigPage workflowId={id} />;
}
