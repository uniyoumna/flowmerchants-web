import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { BaseButton } from "@/components/base/BaseButton";
import type { MerchantDetail } from "../../types";
import { buildMerchantEditHref } from "../../utils/merchantCreateQuery";
import { MerchantStatusBadge } from "../shared/MerchantStatusBadge";

type MerchantDetailHeaderProps = {
  merchant: MerchantDetail;
};

/** Small monospaced chip used for identifiers. */
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
    {children}
  </span>
);

const MerchantDetailHeader = ({ merchant }: MerchantDetailHeaderProps) => {
  return (
    <div className="px-6 pt-6 lg:px-8">
      <Link
        href="/merchants"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-[#7C3AED]"
      >
        <ChevronLeft className="size-4" />
        Back to Merchants
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#4C1D95] text-lg font-bold text-white">
            {merchant.initials}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {merchant.name}
              </h1>
              <MerchantStatusBadge status={merchant.status} />
            </div>

            {merchant.arabicName && (
              <p dir="rtl" className="mt-1 text-sm text-slate-400">
                {merchant.arabicName}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Chip>{merchant.code}</Chip>
              {merchant.registrationNumber && (
                <Chip>{merchant.registrationNumber}</Chip>
              )}
              <span className="text-sm text-slate-500">
                {merchant.businessType}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Actions (FE-246: blocking needs a reason, captured next) ─── */}
        <div className="flex shrink-0 items-center gap-3">
          <BaseButton
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-rose-200 px-4 font-semibold text-rose-600 hover:bg-rose-50"
          >
            Block Merchant
          </BaseButton>

          <Link href={buildMerchantEditHref(merchant.id)}>
            <BaseButton
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-slate-200 px-5 font-semibold text-slate-700"
            >
              Edit
            </BaseButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetailHeader;
export { MerchantDetailHeader };
export type { MerchantDetailHeaderProps };
