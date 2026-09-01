import type { Metadata } from "next";
import { RiskFlagsListPage } from "@/modules/riskFlags/components/list/RiskFlagsListPage";

export const metadata: Metadata = {
  title: "Risk Flags",
  description: "Monitor high risk transactions and flagged merchants.",
};

type RiskFlagPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RiskFlagPage({
  searchParams,
}: RiskFlagPageProps) {
  const resolvedSearchParams = await searchParams;

  return <RiskFlagsListPage searchParams={resolvedSearchParams} />;
}
