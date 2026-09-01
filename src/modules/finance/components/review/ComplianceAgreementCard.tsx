import { cn } from "@/lib/utils";
import type { ComplianceAgreementDocument } from "../../types";

type ComplianceAgreementCardProps = {
  document: ComplianceAgreementDocument | null;
};

/**
 * The compliance sign-off carried into finance.
 *
 * Finance configures a merchant on the strength of this approval, so it stays
 * on screen beside the form rather than behind a tab.
 */
const ComplianceAgreementCard = ({
  document,
}: ComplianceAgreementCardProps) => {
  return (
    <aside className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
      <h2 className="text-base font-bold text-slate-900">
        Compliance Agreement
      </h2>

      {!document ? (
        <p className="mt-3 text-sm text-slate-400">
          No compliance report attached.
        </p>
      ) : (
        <div className="mt-4 flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-[11px] font-bold text-white">
            PDF
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {document.name}
            </p>
            <p className={cn("text-xs text-slate-400")}>
              {document.sizeLabel} · {document.status}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ComplianceAgreementCard;
export { ComplianceAgreementCard };
export type { ComplianceAgreementCardProps };
