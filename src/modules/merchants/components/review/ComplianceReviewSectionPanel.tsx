import type {
  ComplianceReviewDetail,
  ComplianceReviewSection,
} from "../../types";
import { ComplianceReviewAgreementSection } from "./ComplianceReviewAgreementSection";
import { ComplianceReviewBankSection } from "./ComplianceReviewBankSection";
import { ComplianceReviewCommercialSection } from "./ComplianceReviewCommercialSection";
import { ComplianceReviewContactsSection } from "./ComplianceReviewContactsSection";
import { ComplianceReviewGeneralSection } from "./ComplianceReviewGeneralSection";

type ComplianceReviewSectionPanelProps = {
  detail: ComplianceReviewDetail;
  section: ComplianceReviewSection;
};

/**
 * Renders whichever section the URL points at. The whole application is already
 * loaded, so switching sections is instant — adding one means a case here plus
 * its panel, and the surrounding chrome is untouched.
 */
const ComplianceReviewSectionPanel = ({
  detail,
  section,
}: ComplianceReviewSectionPanelProps) => {
  switch (section) {
    case "general":
      return <ComplianceReviewGeneralSection general={detail.general} />;

    case "agreement":
      return <ComplianceReviewAgreementSection agreement={detail.agreement} />;

    case "contacts":
      return <ComplianceReviewContactsSection contacts={detail.contacts} />;

    case "bank":
      return <ComplianceReviewBankSection accounts={detail.bankAccounts} />;

    case "commercial":
      return (
        <ComplianceReviewCommercialSection commercial={detail.commercial} />
      );
  }
};

export default ComplianceReviewSectionPanel;
export { ComplianceReviewSectionPanel };
export type { ComplianceReviewSectionPanelProps };
