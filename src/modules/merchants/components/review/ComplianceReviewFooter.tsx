"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { BaseButton } from "@/components/base/BaseButton";
import {
  approveComplianceCaseAction,
  rejectComplianceCaseAction,
} from "../../actions/complianceActions";

type ComplianceReviewFooterProps = {
  caseId: string;
  merchantName: string;
};

/**
 * The decision bar. It stays pinned to the bottom of the screen so a reviewer
 * can act from anywhere in a long application without scrolling back.
 *
 * Both buttons disable while either decision is in flight — a double submit
 * would otherwise race two decisions against the same case.
 */
const ComplianceReviewFooter = ({
  caseId,
  merchantName,
}: ComplianceReviewFooterProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const decide = (decision: "approve" | "reject") => {
    startTransition(async () => {
      const result =
        decision === "approve"
          ? await approveComplianceCaseAction(caseId)
          : await rejectComplianceCaseAction(caseId);

      if (!result.success) {
        toast.error(result.error ?? "Could not record the decision.");
        return;
      }

      toast.success(
        decision === "approve"
          ? `${merchantName} approved.`
          : `${merchantName} rejected.`,
      );

      // The case has left the queue — go back to the worklist.
      router.push("/merchants/compliance");
    });
  };

  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4 lg:px-8">
      <BaseButton
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => decide("reject")}
        className="h-10 rounded-xl border-rose-200 px-6 font-semibold text-rose-600 hover:bg-rose-50"
      >
        Reject
      </BaseButton>

      <BaseButton
        type="button"
        isLoading={isPending}
        loadingText="Saving..."
        onClick={() => decide("approve")}
        className="h-10 rounded-xl bg-emerald-500 px-8 font-semibold text-white hover:bg-emerald-600"
      >
        Approve
      </BaseButton>
    </div>
  );
};

export default ComplianceReviewFooter;
export { ComplianceReviewFooter };
export type { ComplianceReviewFooterProps };
