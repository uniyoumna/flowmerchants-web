import type { Metadata } from "next";
import { ComplianceQueuePage } from "@/modules/merchants/components/compliance/ComplianceQueuePage";

export const metadata: Metadata = {
  title: "Compliance Queue",
  description: "Review and process merchant applications.",
};

type CompliancePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompliancePage({
  searchParams,
}: CompliancePageProps) {
  const resolvedSearchParams = await searchParams;

  return <ComplianceQueuePage searchParams={resolvedSearchParams} />;
}
