import { cn } from "@/lib/utils";
import { formatAmount } from "@/utils/formatters";
import { fetchMerchantTransactions } from "../../services/merchantDetailService";
import type { MerchantDetail } from "../../types";
import { MerchantProductBadges } from "../shared/MerchantProductBadges";

type MerchantOverviewTabProps = {
  merchant: MerchantDetail;
};

const EMPTY = "—";

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
      {label}
    </p>
    <div className="mt-1 text-sm text-slate-800">{children}</div>
  </div>
);

const MerchantOverviewTab = async ({ merchant }: MerchantOverviewTabProps) => {
  const transactions = await fetchMerchantTransactions(merchant.id);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── Business information ─── */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
          <h2 className="text-base font-bold text-slate-900">
            Business Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Business Type">{merchant.businessType}</Field>

            <Field label="Registration No.">
              <span className="font-mono">
                {merchant.registrationNumber ?? EMPTY}
              </span>
            </Field>

            <Field label="Products">
              <MerchantProductBadges
                products={merchant.products.length ? merchant.products : null}
              />
            </Field>

            <Field label="Branches">
              <span className="font-mono">
                {merchant.activeBranches}
                {merchant.maxBranches !== null && (
                  <span className="text-slate-400">
                    {" / "}
                    {merchant.maxBranches} max
                  </span>
                )}
              </span>
            </Field>

            <Field label="Contract Expiry">
              <span className="font-mono">
                {merchant.contractExpiry ?? EMPTY}
              </span>
            </Field>

            <Field label="Renewal State">
              <span className="text-slate-400">{merchant.renewalState}</span>
            </Field>
          </div>
        </div>

        {/* ─── Assigned team (US-019) ─── */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Assigned Team</h2>

          {merchant.team.length === 0 ? (
            <p className="mt-5 text-sm text-slate-400">
              No owners assigned yet.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {merchant.team.map((member) => (
                <li key={member.role} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-xs font-bold text-white">
                    {member.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ─── Recent transactions (FE-141) ─── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        <h2 className="border-b border-slate-100 px-6 py-4 text-base font-bold text-slate-900">
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-400">
            No transactions for this merchant yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  {["ID", "Branch", "Customer", "Type", "Amount", "Date"].map(
                    (heading, index) => (
                      <th
                        key={heading}
                        className={cn(
                          "px-6 py-3 text-xs font-semibold tracking-wider text-slate-400 uppercase",
                          index === 4 && "text-right",
                        )}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-3.5 font-mono text-xs text-[#7C3AED]">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {transaction.branch}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          transaction.type === "refund"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-purple-50 text-[#7C3AED]",
                        )}
                      >
                        {transaction.type === "refund" ? "Refund" : "Purchase"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-900">
                      {merchant.currency} {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantOverviewTab;
export { MerchantOverviewTab };
export type { MerchantOverviewTabProps };
