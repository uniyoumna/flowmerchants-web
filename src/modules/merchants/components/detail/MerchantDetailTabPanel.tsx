import type { MerchantDetail, MerchantDetailTab } from "../../types";
import { MerchantBranchesTab } from "./MerchantBranchesTab";
import { MerchantFinancialsTab } from "./MerchantFinancialsTab";
import { MerchantOverviewTab } from "./MerchantOverviewTab";
import { MerchantRiskFlagsTab } from "./MerchantRiskFlagsTab";

type MerchantDetailTabPanelProps = {
  merchant: MerchantDetail;
  tab: MerchantDetailTab;
};

/**
 * Renders whichever tab the URL points at.
 *
 * Each panel fetches its own data, so only the visible one costs a request —
 * switching tabs is ordinary navigation and the panel streams in behind the
 * shell. Adding a tab means a case here plus its panel; the shell is untouched.
 */
const MerchantDetailTabPanel = ({
  merchant,
  tab,
}: MerchantDetailTabPanelProps) => {
  switch (tab) {
    case "overview":
      return <MerchantOverviewTab merchant={merchant} />;

    case "financials":
      return <MerchantFinancialsTab merchant={merchant} />;

    case "risk":
      return <MerchantRiskFlagsTab merchant={merchant} />;

    case "branches":
      return <MerchantBranchesTab merchant={merchant} />;
  }
};

export default MerchantDetailTabPanel;
export { MerchantDetailTabPanel };
export type { MerchantDetailTabPanelProps };
