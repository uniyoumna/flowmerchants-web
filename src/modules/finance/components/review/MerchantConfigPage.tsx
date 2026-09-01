import { notFound } from "next/navigation";
import { fetchMerchantConfig } from "../../services/financeService";
import { MerchantConfigForm } from "./MerchantConfigForm";
import { MerchantConfigHeader } from "./MerchantConfigHeader";
import { MerchantConfigLoadError } from "./MerchantConfigLoadError";

type MerchantConfigPageProps = {
  workflowId: string;
};

/**
 * Sets one merchant's financial parameters.
 *
 * The header and the compliance sign-off are server-rendered; only the form
 * itself is a client component, because it is the only part that needs state.
 *
 * Negative margins cancel the dashboard's padding so the header and the submit
 * bar span the full width of the content area.
 */
const MerchantConfigPage = async ({ workflowId }: MerchantConfigPageProps) => {
  const { data: detail, error } = await fetchMerchantConfig(workflowId);

  if (error) {
    return <MerchantConfigLoadError message={error} />;
  }

  // A workflow that does not exist is a 404, not an error banner.
  if (!detail) {
    notFound();
  }

  return (
    // A plain block, not a flex column: a sticky flex item is only pinned
    // within its flex line, which let the header detach partway down the form.
    // `--config-header` is the pinned header's height — the compliance card
    // parks just below it, so the two never overlap.
    <div className="-m-6 [--config-header:8.5rem] lg:-m-8">
      <MerchantConfigHeader detail={detail} />
      <MerchantConfigForm detail={detail} />
    </div>
  );
};

export default MerchantConfigPage;
export { MerchantConfigPage };
export type { MerchantConfigPageProps };
