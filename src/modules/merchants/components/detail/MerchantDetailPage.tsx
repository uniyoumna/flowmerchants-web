import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  fetchMerchantDetail,
  fetchMerchantDetailCounts,
} from "../../services/merchantDetailService";
import { parseMerchantDetailTab } from "../../utils/merchantDetailQuery";
import type { RawSearchParams } from "../../utils/merchantsQuery";
import { MerchantDetailHeader } from "./MerchantDetailHeader";
import { MerchantDetailKpis } from "./MerchantDetailKpis";
import { MerchantDetailLoadError } from "./MerchantDetailLoadError";
import { MerchantDetailSkeleton } from "./MerchantDetailSkeleton";
import { MerchantDetailTabPanel } from "./MerchantDetailTabPanel";
import { MerchantDetailTabs } from "./MerchantDetailTabs";

type MerchantDetailPageProps = {
  merchantId: string;
  searchParams?: RawSearchParams;
};

/**
 * One merchant's detail screen.
 *
 * The active tab lives in the URL, so every panel is a plain server render that
 * fetches its own data — refresh, browser back and a shared link all land on
 * the same tab. Only the panel streams, so switching tabs leaves the identity
 * header and KPI strip in place rather than blanking the whole page.
 *
 * Negative margins cancel the dashboard's padding so the header block spans the
 * full width and the tab rail can pin itself to the top of the scroll area.
 */
const MerchantDetailPage = async ({
  merchantId,
  searchParams,
}: MerchantDetailPageProps) => {
  const activeTab = parseMerchantDetailTab(searchParams);
  const { data: merchant, error } = await fetchMerchantDetail(merchantId);

  if (error) {
    return <MerchantDetailLoadError message={error} />;
  }

  // A merchant that does not exist is a 404, not an error banner.
  if (!merchant) {
    notFound();
  }

  const counts = await fetchMerchantDetailCounts(merchant);

  return (
    <div className="-m-6 flex flex-1 flex-col lg:-m-8">
      {/* ─── 1. Identity and KPIs — scroll away with the page ─── */}
      <div className="bg-white">
        <MerchantDetailHeader merchant={merchant} />
        <MerchantDetailKpis merchant={merchant} />
      </div>

      {/* ─── 2. Tab rail — the only pinned chrome, so a long panel can still
               be navigated without scrolling back to the top ─── */}
      <div className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <MerchantDetailTabs
          merchantId={merchant.id}
          activeTab={activeTab}
          counts={counts}
        />
      </div>

      {/* ─── 3. Active panel — streams in behind the shell ─── */}
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        {/* Keyed on the tab so switching shows the skeleton, not stale rows. */}
        <Suspense key={activeTab} fallback={<MerchantDetailSkeleton />}>
          <MerchantDetailTabPanel merchant={merchant} tab={activeTab} />
        </Suspense>
      </div>
    </div>
  );
};

export default MerchantDetailPage;
export { MerchantDetailPage };
export type { MerchantDetailPageProps };
