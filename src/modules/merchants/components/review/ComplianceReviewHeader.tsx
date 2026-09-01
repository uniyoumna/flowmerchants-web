import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import { COMPLIANCE_SUBMISSION_TYPE_LABELS } from "../../constants";
import type { ComplianceReviewDetail } from "../../types";
import { ComplianceSlaBar } from "../shared/ComplianceSlaBar";

type ComplianceReviewHeaderProps = {
  detail: ComplianceReviewDetail;
};

const ComplianceReviewHeader = ({ detail }: ComplianceReviewHeaderProps) => {
  return (
    <div className="border-b border-slate-100 bg-white px-6 py-5 lg:px-8">
      <Link
        href="/merchants/compliance"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-[#7C3AED]"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED]">
            <Package className="size-5.5" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {detail.merchantName}
              </h1>

              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {COMPLIANCE_SUBMISSION_TYPE_LABELS[detail.submissionType]}
              </span>
            </div>

            {/* The SLA sits beside the due date so the reviewer sees the
                deadline and how much of the window is gone in one glance. */}
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500">
                Review due:{" "}
                <span className="font-medium text-slate-800">
                  {detail.reviewDue}
                </span>
              </p>

              <ComplianceSlaBar percent={detail.slaPercent} />
            </div>
          </div>
        </div>

        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-sm font-bold text-white">
          {detail.reviewerInitials}
        </span>
      </div>
    </div>
  );
};

export default ComplianceReviewHeader;
export { ComplianceReviewHeader };
export type { ComplianceReviewHeaderProps };
