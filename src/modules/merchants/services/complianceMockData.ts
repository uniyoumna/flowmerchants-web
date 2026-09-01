import type {
  ComplianceCase,
  ComplianceOverview,
  ComplianceReviewDetail,
} from "../types";
import { maskAccountId, toReviewDocument } from "../utils/complianceMapper";

/**
 * ⚠️ TEMPORARY — stand-in data for the compliance queue and review screens.
 *
 * The compliance workflow has no endpoints yet, so the queue rows and the
 * read-back of a submitted application are generated here to let the screens be
 * built and reviewed. Delete this file and flip `USE_MOCK_COMPLIANCE` in
 * `complianceService.ts` when those endpoints land — the view models and every
 * call site stay exactly as they are.
 *
 * Values are fixed rather than randomised so a case shows the same figures on
 * every render; otherwise the server and the browser would disagree and React
 * would report a hydration mismatch.
 */

const MB = 1024 * 1024;

export const MOCK_COMPLIANCE_QUEUE: ComplianceCase[] = [
  {
    id: "CMP-2025-0001",
    merchantId: "MCH-10058",
    merchantName: "Sphinx Furniture & Decor",
    merchantCode: "MCH-10058",
    businessType: "Furniture",
    submissionType: "initial",
    slaPercent: 71,
    submittedBy: "Sara Hassan",
    submittedAt: "2025-01-04 10:22",
    status: "pending_review",
    assignedTo: null,
    dueDate: "7/20/2026",
  },
  {
    id: "CMP-2025-0002",
    merchantId: "MCH-10063",
    merchantName: "Eastern Pharma Distribution",
    merchantCode: "MCH-10063",
    businessType: "Healthcare & Pharma",
    submissionType: "renewal",
    slaPercent: 86,
    submittedBy: "Laila Nasser",
    submittedAt: "2025-01-03 14:05",
    status: "under_review",
    assignedTo: "Mostafa Ali",
    dueDate: "7/20/2026",
  },
  {
    id: "CMP-2025-0003",
    merchantId: "MCH-10042",
    merchantName: "Cairo Electronics Co.",
    merchantCode: "MCH-10042",
    businessType: "Electronics",
    submissionType: "initial",
    slaPercent: 45,
    submittedBy: "Ahmed Khalil",
    submittedAt: "2025-01-05 09:15",
    status: "pending_review",
    assignedTo: null,
    dueDate: "7/25/2026",
  },
  {
    id: "CMP-2025-0004",
    merchantId: "MCH-10071",
    merchantName: "Nile Textiles Group",
    merchantCode: "MCH-10071",
    businessType: "Textiles",
    submissionType: "renewal",
    slaPercent: 92,
    submittedBy: "Mona Adel",
    submittedAt: "2025-01-02 16:40",
    status: "under_review",
    assignedTo: "Sara Hassan",
    dueDate: "7/18/2026",
  },
  {
    id: "CMP-2025-0005",
    merchantId: "MCH-10084",
    merchantName: "Delta Auto Services",
    merchantCode: "MCH-10084",
    businessType: "Automotive",
    submissionType: "initial",
    slaPercent: 30,
    submittedBy: "Dina Farouk",
    submittedAt: "2025-01-06 11:00",
    status: "pending_review",
    assignedTo: null,
    dueDate: "7/28/2026",
  },
];

export function mockComplianceOverview(): ComplianceOverview {
  return {
    underReview: 10,
    slaOverdue: 2,
    pendingReview: 1,
    expiryRisk: 1,
  };
}

/**
 * The full read-back of one application. Every field mirrors a wizard step, so
 * a reviewer sees precisely what the merchant submitted.
 */
export function mockComplianceReviewDetail(
  queued: ComplianceCase,
): ComplianceReviewDetail {
  return {
    id: queued.id,
    merchantId: queued.merchantId,
    merchantName: queued.merchantName,
    submissionType: queued.submissionType,
    status: queued.status,
    reviewDue: "2025-01-10",
    slaPercent: queued.slaPercent,
    reviewerInitials: "F",

    general: {
      commercialNameEn: "Sphinx Furniture & Decor",
      commercialNameAr: "أبو الهول للأثاث والديكور",
      logo: toReviewDocument("Merchant Logo.png", 5.3 * MB),
      primaryContactName: "Karim Sherif",
      email: "karim@sphinxfurniture.eg",
      mobileNumber: "+20 10 1234 5678",
      landline: "+20 2 1234 5678",
      website: "https://www.sphinxfurniture.eg",
      mobileAppDeepLink: "sphinxapp://furniture/home",
      governorate: "Cairo",
      city: "Cairo",
      area: "Nasr City",
      fullAddress: "45 Abbas El Akkad St, Nasr City, Cairo",
      businessTypes: ["Furniture", "Home Decor"],
      financingType: "Consumer Finance",
      registeredNameEn: "Sphinx Furniture & Decor LLC",
      registeredNameAr: "شركة أبو الهول للأثاث والديكور",
      crNumber: "CR-20251234",
      vatNumber: "VAT-300451",
      crDocument: toReviewDocument("CR Document.pdf", 5.3 * MB),
      vatCertificate: toReviewDocument("VAT Certificate.pdf", 5.3 * MB),
    },

    agreement: {
      signedAgreement: toReviewDocument("Signed Agreement.pdf", 5.3 * MB),
      agreementReference: "AGR-2025-00142",
      signatureDate: "5/8/2026",
      effectiveDate: "5/8/2026",
    },

    contacts: {
      financeEmail: "finance@sphinxfurniture.eg",
      escalationContacts: [
        {
          fullName: "Mohamed Salah",
          role: "Operations Manager",
          email: "msalah@sphinx.eg",
          phone: "+20 10 9876 5432",
          level: "1",
        },
        {
          fullName: "Nour Ibrahim",
          role: "Customer Relations",
          email: "nibrahim@sphinx.eg",
          phone: "+20 11 1234 0000",
          level: "2",
        },
      ],
      accountManagers: [
        {
          fullName: "Yasmine Fathy",
          email: "yfathy@sphinx.eg",
          phone: "+20 12 3456 7890",
          isPrimary: true,
        },
      ],
    },

    bankAccounts: [
      {
        id: "BANK-1",
        bankName: "CIB — Commercial International Bank",
        bankBranch: "Nasr City Branch",
        accountHolderName: "Sphinx Furniture LLC",
        accountType: "Current",
        phone: "+20 10 1234 5678",
        country: "Egypt",
        currency: "EGP",
        swift: "CIBEEGCX",
        accountNumber: maskAccountId("1234567890126548"),
        iban: maskAccountId("EG380019000500000000266548", 2),
        isDefault: true,
        isFrozen: false,
      },
    ],

    commercial: {
      minTicketSize: "5,000",
      maxTicketSize: "100,000",
      currency: "EGP",
      maxBranches: "20",
      maxSalesPersons: "150",
    },
  };
}
