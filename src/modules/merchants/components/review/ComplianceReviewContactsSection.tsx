import type React from "react";
import type { ComplianceReviewContacts } from "../../types";
import { ComplianceReviewField } from "./ComplianceReviewField";
import { ComplianceReviewGroup } from "./ComplianceReviewGroup";

type ComplianceReviewContactsSectionProps = {
  contacts: ComplianceReviewContacts;
};

/** Both collections are tables, so they share one header/cell treatment. */
const HeaderCell = ({ children }: { children: React.ReactNode }) => (
  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">
    {children}
  </th>
);

const Cell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-3 py-3 align-top text-sm font-medium text-slate-900">
    {children}
  </td>
);

/** Read-back of wizard step 3 — finance, escalation tiers, account managers. */
const ComplianceReviewContactsSection = ({
  contacts,
}: ComplianceReviewContactsSectionProps) => {
  return (
    <div className="space-y-8">
      <dl>
        <ComplianceReviewField
          label="Finance Team Contact Email"
          value={contacts.financeEmail}
        />
      </dl>

      <ComplianceReviewGroup title="Complaint Escalation Contacts">
        {/* A row per tier — the table is wider than a phone, so it scrolls. */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 border-collapse">
            <thead className="border-b border-slate-100">
              <tr>
                <HeaderCell>{""}</HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Role</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Phone</HeaderCell>
                <HeaderCell>Level</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {contacts.escalationContacts.map((contact, index) => (
                <tr key={`${contact.email}-${contact.level}`}>
                  <td className="px-3 py-3 align-top text-sm text-slate-400">
                    Contact #{index + 1}
                  </td>
                  <Cell>{contact.fullName}</Cell>
                  <Cell>{contact.role}</Cell>
                  <Cell>{contact.email}</Cell>
                  <Cell>{contact.phone}</Cell>
                  <Cell>{contact.level}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComplianceReviewGroup>

      <ComplianceReviewGroup title="Account Managers">
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 border-collapse">
            <thead className="border-b border-slate-100">
              <tr>
                <HeaderCell>{""}</HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Phone</HeaderCell>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {contacts.accountManagers.map((manager, index) => (
                <tr key={manager.email}>
                  <td className="px-3 py-3 align-top text-sm text-slate-400">
                    Manager #{index + 1}
                  </td>
                  <Cell>
                    <span className="flex flex-wrap items-center gap-2">
                      {manager.fullName}
                      {/* The primary manager receives the activation invite,
                          so the reviewer needs to see which one it is. */}
                      {manager.isPrimary && (
                        <span className="rounded-md bg-[#7C3AED]/10 px-1.5 py-0.5 text-[11px] font-semibold text-[#7C3AED]">
                          Primary
                        </span>
                      )}
                    </span>
                  </Cell>
                  <Cell>{manager.email}</Cell>
                  <Cell>{manager.phone}</Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComplianceReviewGroup>
    </div>
  );
};

export default ComplianceReviewContactsSection;
export { ComplianceReviewContactsSection };
export type { ComplianceReviewContactsSectionProps };
