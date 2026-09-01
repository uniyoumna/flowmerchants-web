import type { ComplianceReviewAgreement } from "../../types";
import { ComplianceReviewDocument } from "./ComplianceReviewDocument";
import { ComplianceReviewField } from "./ComplianceReviewField";
import { ComplianceReviewGroup } from "./ComplianceReviewGroup";

type ComplianceReviewAgreementSectionProps = {
  agreement: ComplianceReviewAgreement;
};

/** Read-back of wizard step 2 — the signed contract and its dates. */
const ComplianceReviewAgreementSection = ({
  agreement,
}: ComplianceReviewAgreementSectionProps) => {
  return (
    <ComplianceReviewGroup title="Signed Agreement">
      <ComplianceReviewField label="Signed Agreement Upload">
        <ComplianceReviewDocument document={agreement.signedAgreement} />
      </ComplianceReviewField>
      <ComplianceReviewField
        label="Agreement Reference Number"
        value={agreement.agreementReference}
        mono
      />
      <ComplianceReviewField
        label="Signature Date"
        value={agreement.signatureDate}
      />
      <ComplianceReviewField
        label="Effective Date"
        value={agreement.effectiveDate}
      />
    </ComplianceReviewGroup>
  );
};

export default ComplianceReviewAgreementSection;
export { ComplianceReviewAgreementSection };
export type { ComplianceReviewAgreementSectionProps };
