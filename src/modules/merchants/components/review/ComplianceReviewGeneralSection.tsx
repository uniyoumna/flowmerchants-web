import type { ComplianceReviewGeneral } from "../../types";
import { ComplianceReviewDocument } from "./ComplianceReviewDocument";
import { ComplianceReviewField } from "./ComplianceReviewField";
import { ComplianceReviewGroup } from "./ComplianceReviewGroup";

type ComplianceReviewGeneralSectionProps = {
  general: ComplianceReviewGeneral;
};

/** Read-back of wizard step 1 — identity, contact, address, classification. */
const ComplianceReviewGeneralSection = ({
  general,
}: ComplianceReviewGeneralSectionProps) => {
  return (
    <div className="space-y-8">
      <ComplianceReviewGroup title="Business Identity">
        <ComplianceReviewField
          label="Commercial Name (English)"
          value={general.commercialNameEn}
        />
        <ComplianceReviewField
          label="Commercial Name (Arabic)"
          value={general.commercialNameAr}
          dir="rtl"
        />
        <ComplianceReviewField label="Merchant Logo">
          <ComplianceReviewDocument document={general.logo} />
        </ComplianceReviewField>
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Contact Details">
        <ComplianceReviewField
          label="Primary Contact Name"
          value={general.primaryContactName}
        />
        <ComplianceReviewField label="Email Address" value={general.email} />
        <ComplianceReviewField
          label="Mobile Number"
          value={general.mobileNumber}
        />
        <ComplianceReviewField label="Landline" value={general.landline} />
        <ComplianceReviewField
          label="Merchant Website"
          value={general.website}
        />
        <ComplianceReviewField
          label="Mobile App Deep Link"
          value={general.mobileAppDeepLink}
        />
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Address">
        <ComplianceReviewField
          label="Governorate"
          value={general.governorate}
        />
        <ComplianceReviewField label="City" value={general.city} />
        <ComplianceReviewField label="Area" value={general.area} />
        <ComplianceReviewField
          label="Full Address"
          value={general.fullAddress}
        />
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Classification">
        <ComplianceReviewField
          label="Business Types"
          value={general.businessTypes.join(", ")}
        />
        <ComplianceReviewField
          label="Financing Type"
          value={general.financingType}
        />
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Legal Documents">
        <ComplianceReviewField
          label="Registered Business Name (English)"
          value={general.registeredNameEn}
        />
        <ComplianceReviewField
          label="Registered Business Name (Arabic)"
          value={general.registeredNameAr}
          dir="rtl"
        />
        <ComplianceReviewField
          label="CR Number"
          value={general.crNumber}
          mono
        />
        <ComplianceReviewField
          label="VAT Number"
          value={general.vatNumber}
          mono
        />
        <ComplianceReviewField label="CR Document">
          <ComplianceReviewDocument document={general.crDocument} />
        </ComplianceReviewField>
        <ComplianceReviewField label="VAT Certificate">
          <ComplianceReviewDocument document={general.vatCertificate} />
        </ComplianceReviewField>
      </ComplianceReviewGroup>
    </div>
  );
};

export default ComplianceReviewGeneralSection;
export { ComplianceReviewGeneralSection };
export type { ComplianceReviewGeneralSectionProps };
