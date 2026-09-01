import type {
  ConfigOverview,
  ConfigWorkflow,
  MerchantConfigDetail,
} from "../types";

/**
 * ⚠️ TEMPORARY — stand-in data for the merchant configuration screens.
 *
 * The finance configuration endpoints are not deployed yet. Delete this file
 * and flip `USE_MOCK_FINANCE` in `financeService.ts` when they land — the view
 * models and every call site stay exactly as they are.
 */
export const MOCK_CONFIG_WORKFLOWS: ConfigWorkflow[] = [
  {
    id: "CFG-2025-0001",
    merchantId: "MCH-10063",
    merchantName: "Eastern Pharma Distribution",
    merchantCode: "MCH-10063",
    businessType: "Healthcare & Pharma",
    submissionType: "renewal",
    slaPercent: 64,
    submittedBy: "Laila Nasser",
    submittedAt: "2025-01-03 14:05",
    status: "pending_review",
    assignedTo: null,
    dueDate: "7/20/2026",
  },
  {
    id: "CFG-2025-0002",
    merchantId: "MCH-10058",
    merchantName: "Sphinx Furniture & Decor",
    merchantCode: "MCH-10058",
    businessType: "Furniture",
    submissionType: "initial",
    slaPercent: 78,
    submittedBy: "Sara Hassan",
    submittedAt: "2025-01-04 10:22",
    status: "under_review",
    assignedTo: "Yara Selim",
    dueDate: "7/22/2026",
  },
];

/**
 * Queue-wide counters. Left as fixed figures rather than derived from the rows
 * above: they cover the whole finance backlog, not the page on screen, so the
 * endpoint will report them directly.
 */
export function mockConfigOverview(): ConfigOverview {
  return {
    underReview: 10,
    slaOverdue: 2,
    pendingReview: 1,
    expiryRisk: 1,
  };
}

/** The configuration screen behind one queue row. */
export function mockMerchantConfigDetail(
  workflow: ConfigWorkflow,
): MerchantConfigDetail {
  return {
    id: workflow.id,
    merchantId: workflow.merchantId,
    merchantName: workflow.merchantName,
    submissionType: workflow.submissionType,
    status: workflow.status,
    reviewDue: "2025-01-10",
    slaPercent: workflow.slaPercent,
    reviewerInitials: "F",
    complianceAgreement: {
      name: "Compliance Report.pdf",
      sizeLabel: "4.1 MB",
      status: "approved",
      url: null,
    },
    // Nothing saved yet — the form opens on its defaults.
    config: null,
  };
}
