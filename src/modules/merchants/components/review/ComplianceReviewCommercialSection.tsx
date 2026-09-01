import type { ComplianceReviewCommercial } from "../../types";
import { ComplianceReviewField } from "./ComplianceReviewField";
import { ComplianceReviewGroup } from "./ComplianceReviewGroup";

type ComplianceReviewCommercialSectionProps = {
  commercial: ComplianceReviewCommercial;
};

/** Read-back of wizard step 5 — ticket size and capacity limits. */
const ComplianceReviewCommercialSection = ({
  commercial,
}: ComplianceReviewCommercialSectionProps) => {
  return (
    <div className="space-y-8">
      <ComplianceReviewGroup title="Ticket Size Limits">
        <ComplianceReviewField
          label="Minimum Ticket Size"
          value={commercial.minTicketSize}
          mono
        />
        <ComplianceReviewField
          label="Maximum Ticket Size"
          value={commercial.maxTicketSize}
          mono
        />
        <ComplianceReviewField label="Currency" value={commercial.currency} />
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Capacity Limits">
        <ComplianceReviewField
          label="Maximum Branches"
          value={commercial.maxBranches}
          mono
        />
        <ComplianceReviewField
          label="Maximum Sales Persons"
          value={commercial.maxSalesPersons}
          mono
        />
      </ComplianceReviewGroup>
    </div>
  );
};

export default ComplianceReviewCommercialSection;
export { ComplianceReviewCommercialSection };
export type { ComplianceReviewCommercialSectionProps };
