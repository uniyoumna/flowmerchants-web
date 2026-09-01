"use client";

import { SquarePen, Trash2 } from "lucide-react";
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  BANK_COUNTRY_OPTIONS,
  BANK_OPTIONS,
} from "../../constants";
import type { BankAccountValues } from "../../schemas/merchantBankAccountsSchema";

type MerchantBankAccountCardProps = {
  account: BankAccountValues;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  /** Hides the delete action on the last remaining account. */
  canDelete: boolean;
};

const EMPTY = "—";

/** Master-data value → its label, falling back to the raw value. */
function labelOf(
  options: { label: string; value: string }[],
  value: string,
): string {
  if (!value) return EMPTY;
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * FE-050 — account numbers and IBANs are masked on screen; only the last four
 * characters are shown so an account can still be told apart.
 */
function mask(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return EMPTY;
  if (trimmed.length <= 4) return "••••";
  return `•••• ${trimmed.slice(-4)}`;
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm text-slate-500">
    {label} : <span className="text-slate-800">{value}</span>
  </p>
);

const MerchantBankAccountCard = ({
  account,
  index,
  onEdit,
  onDelete,
  onSetDefault,
  canDelete,
}: MerchantBankAccountCardProps) => {
  return (
    <div className="relative rounded-xl border border-slate-100 p-5">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-bold text-slate-900">
            Bank Account #{index + 1}
          </h4>

          {account.isDefault && (
            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-[#7C3AED]">
              Default
            </span>
          )}

          {account.isFrozen && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
              Frozen
            </span>
          )}
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete bank account ${index + 1}`}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {/* ─── Details ─── */}
      <div className="mt-4 grid gap-x-6 gap-y-2 md:grid-cols-3">
        <Detail
          label="Bank Name"
          value={labelOf(BANK_OPTIONS, account.bankName)}
        />
        <Detail label="Bank Branch" value={account.bankBranch || EMPTY} />
        <Detail
          label="Account Holder Name"
          value={account.accountHolderName || EMPTY}
        />

        <Detail
          label="Account Type"
          value={labelOf(BANK_ACCOUNT_TYPE_OPTIONS, account.accountType)}
        />
        <Detail label="Phone" value={account.phone?.trim() || EMPTY} />
        <Detail
          label="Country"
          value={labelOf(BANK_COUNTRY_OPTIONS, account.country)}
        />

        <Detail label="Currency" value={account.currency || EMPTY} />
        <Detail label="Account Number" value={mask(account.accountNumber)} />
        <Detail label="IBAN" value={mask(account.iban)} />

        <Detail label="SWIFT / BIC" value={account.swift?.trim() || EMPTY} />
      </div>

      {/* ─── Actions ─── */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-50 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-[#7C3AED]"
        >
          <SquarePen className="size-4" />
          Edit Account
        </button>

        {/* FE-046 — exactly one active default per settlement currency. */}
        {!account.isDefault && !account.isFrozen && (
          <button
            type="button"
            onClick={onSetDefault}
            className="cursor-pointer text-sm font-medium text-[#7C3AED] transition-colors hover:text-[#6D28D9]"
          >
            Set as default for {account.currency}
          </button>
        )}
      </div>
    </div>
  );
};

export default MerchantBankAccountCard;
export { MerchantBankAccountCard };
export type { MerchantBankAccountCardProps };
