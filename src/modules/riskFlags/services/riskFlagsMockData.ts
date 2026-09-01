import type { RiskFlagCase } from "../types";

/**
 * ⚠️ TEMPORARY — stand-in data for the risk flag cases screen.
 *
 * The risk flag endpoints are not deployed yet. Delete this file and flip
 * `USE_MOCK_RISK_FLAGS` in `riskFlagsService.ts` when they land — the view
 * models and every call site stay exactly as they are.
 *
 * One open case, two under review and one resolved; two are high severity and
 * both belong to the same blocked merchant. The KPI cards are counted from
 * these rows rather than hardcoded, so the cards and the table cannot disagree.
 */
export const MOCK_RISK_FLAG_CASES: RiskFlagCase[] = [
  {
    id: "RF-20250106-003",
    caseId: "RF-20250106-003",
    merchantId: "MCH-10051",
    merchantName: "Delta Home Appliances",
    merchantCode: "MCH-10051",
    branchName: "Maadi Branch",
    type: "purchase_spike",
    metric: "Purchase Amount (Daily)",
    observed: "EGP 148,200",
    threshold: "+280% vs. 30-day avg",
    severity: "high",
    status: "open",
    detectedAt: "2025-01-06 09:41",
    // Nobody has picked this one up yet.
    assignedTo: null,
    entityBlocked: true,
  },
  {
    id: "RF-20250105-007",
    caseId: "RF-20250105-007",
    merchantId: "MCH-10051",
    merchantName: "Delta Home Appliances",
    merchantCode: "MCH-10051",
    // Tripped across the whole merchant rather than one branch.
    branchName: "",
    type: "refund_spike",
    metric: "Refund Count (Weekly)",
    observed: "84 refunds",
    threshold: "+664% vs. 4-week avg",
    severity: "high",
    status: "under_review",
    detectedAt: "2025-01-05 14:32",
    assignedTo: "Fatma Youssef",
    entityBlocked: true,
  },
  {
    id: "RF-20250103-002",
    caseId: "RF-20250103-002",
    merchantId: "MCH-10039",
    merchantName: "Nile Fashion Group",
    merchantCode: "MCH-10039",
    branchName: "Alexandria Branch",
    type: "purchase_spike",
    metric: "Purchase Count (Daily)",
    observed: "219 transactions",
    threshold: "+253% vs. 30-day avg",
    severity: "medium",
    status: "under_review",
    detectedAt: "2025-01-03 11:08",
    assignedTo: "Khalid Mansour",
    entityBlocked: false,
  },
  {
    id: "RF-20241228-010",
    caseId: "RF-20241228-010",
    merchantId: "MCH-10042",
    merchantName: "Cairo Electronics Co.",
    merchantCode: "MCH-10042",
    branchName: "Nasr City Branch",
    type: "chargeback_spike",
    metric: "Chargeback Ratio (Monthly)",
    observed: "4.8%",
    threshold: "+122% vs. 3-month avg",
    severity: "low",
    status: "resolved",
    detectedAt: "2024-12-28 16:55",
    assignedTo: "Khalid Mansour",
    entityBlocked: false,
  },
];
