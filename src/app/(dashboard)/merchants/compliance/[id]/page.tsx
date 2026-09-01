import type { Metadata } from "next";
import { ComplianceReviewPage } from "@/modules/merchants/components/review/ComplianceReviewPage";

export const metadata: Metadata = {
  title: "Review Submission",
  description: "Read-only review of a submitted merchant application.",
};

type ComplianceReviewRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ComplianceReviewRoute({
  params,
  searchParams,
}: ComplianceReviewRouteProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <ComplianceReviewPage caseId={id} searchParams={resolvedSearchParams} />
  );
}
