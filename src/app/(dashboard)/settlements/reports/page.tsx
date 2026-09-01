import type { Metadata } from "next";
import { SettlementsReportPage } from "@/modules/settlements/components/reports/SettlementsReportPage";

export const metadata: Metadata = {
  title: "Settlement Reports",
  description: "View and export financial settlement reports.",
};

export default function SettlementReportsPage() {
  return <SettlementsReportPage />;
}
