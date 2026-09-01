import { Landmark } from "lucide-react";
import type { ComplianceReviewBankAccount } from "../../types";
import { ComplianceReviewField } from "./ComplianceReviewField";

type ComplianceReviewBankSectionProps = {
  accounts: ComplianceReviewBankAccount[];
};

/**
 * Read-back of wizard step 4 — one card per settlement account.
 *
 * Account numbers and IBANs arrive already masked from the server: reviewing an
 * application never requires the full number, so it is not sent to the browser.
 */
const ComplianceReviewBankSection = ({
  accounts,
}: ComplianceReviewBankSectionProps) => {
  if (accounts.length === 0) {
    return (
      <div className="py-16 text-center">
        <Landmark className="mx-auto size-8 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-700">
          No settlement account registered
        </p>
        <p className="mt-1 text-sm text-slate-500">
          This application cannot be approved until the merchant adds one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {accounts.map((account) => (
        <section key={account.id} className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              {account.bankName}
            </h3>

            {account.isDefault && (
              <span className="rounded-md bg-[#7C3AED]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
                Default
              </span>
            )}

            {/* A frozen account stays on record but cannot receive settlement. */}
            {account.isFrozen && (
              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
                Frozen
              </span>
            )}
          </div>

          <dl>
            <ComplianceReviewField
              label="Bank Branch"
              value={account.bankBranch}
            />
            <ComplianceReviewField
              label="Account Holder Name"
              value={account.accountHolderName}
            />
            <ComplianceReviewField
              label="Account Type"
              value={account.accountType}
            />
            <ComplianceReviewField label="Phone" value={account.phone} />
            <ComplianceReviewField label="Country" value={account.country} />
            <ComplianceReviewField label="Currency" value={account.currency} />
            <ComplianceReviewField
              label="SWIFT / BIC"
              value={account.swift}
              mono
            />
            <ComplianceReviewField
              label="Account Number"
              value={account.accountNumber}
              mono
            />
            <ComplianceReviewField label="IBAN" value={account.iban} mono />
          </dl>
        </section>
      ))}
    </div>
  );
};

export default ComplianceReviewBankSection;
export { ComplianceReviewBankSection };
export type { ComplianceReviewBankSectionProps };
