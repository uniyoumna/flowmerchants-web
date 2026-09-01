import { notFound } from "next/navigation";
import { COMPLIANCE_REVIEW_SECTION_LABELS } from "../../constants";
import { fetchComplianceCase } from "../../services/complianceService";
import { parseComplianceReviewSection } from "../../utils/complianceQuery";
import type { RawSearchParams } from "../../utils/merchantsQuery";
import { ComplianceReviewFooter } from "./ComplianceReviewFooter";
import { ComplianceReviewHeader } from "./ComplianceReviewHeader";
import { ComplianceReviewLoadError } from "./ComplianceReviewLoadError";
import { ComplianceReviewNav } from "./ComplianceReviewNav";
import { ComplianceReviewSectionPanel } from "./ComplianceReviewSectionPanel";

type ComplianceReviewPageProps = {
  caseId: string;
  searchParams?: RawSearchParams;
};

/**
 * Read-only review of one merchant application.
 *
 * The whole submission is fetched once and the sidebar switches which part of
 * it is on screen, so moving between sections costs no request. The section
 * lives in the URL, which makes a link to "the bank details of this case"
 * shareable and keeps browser back working between sections.
 *
 * Negative margins cancel the dashboard's padding so the header and the
 * decision bar span the full width of the content area.
 */
const ComplianceReviewPage = async ({
  caseId,
  searchParams,
}: ComplianceReviewPageProps) => {
  const activeSection = parseComplianceReviewSection(searchParams);
  const { data: detail, error } = await fetchComplianceCase(caseId);

  if (error) {
    return <ComplianceReviewLoadError message={error} />;
  }

  // A submission that does not exist is a 404, not an error banner.
  if (!detail) {
    notFound();
  }

  return (
    <div className="-m-6 flex min-h-full flex-1 flex-col lg:-m-8">
      {/* ─── 1. Identity, SLA and the way back to the queue ─── */}
      <ComplianceReviewHeader detail={detail} />

      {/* ─── 2. Active section beside the section switcher ─── */}
      <div className="flex-1 px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {COMPLIANCE_REVIEW_SECTION_LABELS[activeSection]}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Read-only review of submitted data
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
              <ComplianceReviewSectionPanel
                detail={detail}
                section={activeSection}
              />
            </div>
          </div>

          {/* The switcher sticks so it stays reachable in a long section. */}
          <div className="lg:sticky lg:top-6 lg:w-72 lg:shrink-0">
            <ComplianceReviewNav
              caseId={detail.id}
              activeSection={activeSection}
            />
          </div>
        </div>
      </div>

      {/* ─── 3. Decision bar ─── */}
      <ComplianceReviewFooter
        caseId={detail.id}
        merchantName={detail.merchantName}
      />
    </div>
  );
};

export default ComplianceReviewPage;
export { ComplianceReviewPage };
export type { ComplianceReviewPageProps };
