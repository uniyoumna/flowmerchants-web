import type { Metadata } from "next";
import { ConfigQueuePage } from "@/modules/finance/components/configuration/ConfigQueuePage";

export const metadata: Metadata = {
  title: "Merchant Configuration",
  description: "Set financial parameters for approved merchants.",
};

type ConfigurationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ConfigurationPage({
  searchParams,
}: ConfigurationPageProps) {
  const resolvedSearchParams = await searchParams;

  return <ConfigQueuePage searchParams={resolvedSearchParams} />;
}
