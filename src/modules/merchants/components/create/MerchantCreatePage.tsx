import { Suspense } from "react";
import {
  parseMerchantCreateSearchParams,
  serializeMerchantCreateQuery,
} from "../../utils/merchantCreateQuery";
import type { RawSearchParams } from "../../utils/merchantsQuery";
import { MerchantCreateHeader } from "./MerchantCreateHeader";
import { MerchantCreateStepper } from "./MerchantCreateStepper";
import { MerchantStepHeading } from "./MerchantStepHeading";
import { MerchantStepSection } from "./MerchantStepSection";
import { MerchantStepSkeleton } from "./MerchantStepSkeleton";

type MerchantCreatePageProps = {
  searchParams?: RawSearchParams;
};

/**
 * The merchant onboarding wizard shell.
 *
 * The step and draft ID live in the URL, so each step is an ordinary server
 * render that fetches its own saved data — refresh, browser back and a shared
 * link all land exactly where the user left off.
 *
 * Negative margins cancel the dashboard's padding so the header block and the
 * action bar span the full width and can stick to the top and bottom of the
 * scroll container while the step body scrolls between them.
 */
const MerchantCreatePage = ({ searchParams }: MerchantCreatePageProps) => {
  const query = parseMerchantCreateSearchParams(searchParams);

  return (
    <div className="-m-6 flex flex-1 flex-col lg:-m-8">
      {/* ─── 1. Fixed chrome: breadcrumb, title and step rail ─── */}
      <div className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <MerchantCreateHeader />
        <MerchantCreateStepper
          currentStep={query.step}
          draftId={query.draftId}
        />
      </div>

      {/* ─── 2. Step body — scrolls between the fixed rail and action bar ─── */}
      <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
        <MerchantStepHeading step={query.step} />

        {/* Keyed on the step so switching steps shows the skeleton, not stale fields. */}
        <Suspense
          key={serializeMerchantCreateQuery(query)}
          fallback={<MerchantStepSkeleton />}
        >
          <MerchantStepSection step={query.step} draftId={query.draftId} />
        </Suspense>
      </div>
    </div>
  );
};

export default MerchantCreatePage;
export { MerchantCreatePage };
export type { MerchantCreatePageProps };
