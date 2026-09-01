import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  COMPLIANCE_REVIEW_SECTION_LABELS,
  COMPLIANCE_REVIEW_SECTION_ORDER,
} from "../../constants";
import type { ComplianceReviewSection } from "../../types";
import { buildComplianceReviewHref } from "../../utils/complianceQuery";

type ComplianceReviewNavProps = {
  caseId: string;
  activeSection: ComplianceReviewSection;
};

/**
 * The section switcher. Each entry is a real link that writes `?section=` to the
 * URL, so a reviewer can deep-link a colleague straight to the bank details and
 * browser back steps between sections.
 */
const ComplianceReviewNav = ({
  caseId,
  activeSection,
}: ComplianceReviewNavProps) => {
  return (
    <nav
      aria-label="Review sections"
      className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
    >
      {COMPLIANCE_REVIEW_SECTION_ORDER.map((section) => {
        const isActive = section === activeSection;

        return (
          <Link
            key={section}
            href={buildComplianceReviewHref(caseId, section)}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors",
              isActive
                ? "border-[#7C3AED]/40 bg-[#7C3AED]/5 text-slate-900"
                : "border-slate-100 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800",
            )}
          >
            {COMPLIANCE_REVIEW_SECTION_LABELS[section]}
          </Link>
        );
      })}
    </nav>
  );
};

export default ComplianceReviewNav;
export { ComplianceReviewNav };
export type { ComplianceReviewNavProps };
