"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, type Resolver, useForm } from "react-hook-form";
import { BaseModal } from "@/components/base/BaseModal";
import { FormInput, FormSelect } from "@/components/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  BANK_ACCOUNT_TYPE_OPTIONS,
  BANK_COUNTRY_OPTIONS,
  BANK_OPTIONS,
  CURRENCY_OPTIONS,
  SECURE_ACCOUNT_CONFIRMATION,
} from "../../constants";
import {
  type BankAccountValues,
  bankAccountSchema,
  EMPTY_BANK_ACCOUNT,
} from "../../schemas/merchantBankAccountsSchema";

type MerchantBankAccountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Values to edit, or `null` to add a new account. */
  account: BankAccountValues | null;
  onSubmit: (values: BankAccountValues) => void;
};

/**
 * Add / edit a settlement bank account.
 *
 * The dialog runs its **own** form instance rather than writing into the step
 * form directly: an account is only committed to the field array once it is
 * valid, so a half-filled dialog can be cancelled without leaving an invalid
 * row behind. It is rendered in a portal, so it is not nested inside the step's
 * `<form>` element.
 */
const MerchantBankAccountDialog = ({
  isOpen,
  onClose,
  account,
  onSubmit,
}: MerchantBankAccountDialogProps) => {
  const form = useForm<BankAccountValues>({
    resolver: zodResolver(bankAccountSchema) as Resolver<BankAccountValues>,
    defaultValues: account ?? EMPTY_BANK_ACCOUNT,
  });

  // The dialog stays mounted between openings, so its fields are re-seeded
  // whenever it opens on a different account.
  useEffect(() => {
    if (isOpen) form.reset(account ?? EMPTY_BANK_ACCOUNT);
  }, [isOpen, account, form]);

  const submit = form.handleSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  /** FE-043 — confirmation fields reject paste and autofill when enabled. */
  const secureConfirmProps = SECURE_ACCOUNT_CONFIRMATION
    ? {
        onPaste: (event: React.ClipboardEvent<HTMLInputElement>) =>
          event.preventDefault(),
        onDrop: (event: React.DragEvent<HTMLInputElement>) =>
          event.preventDefault(),
        autoComplete: "off" as const,
        helperText: "Re-type the value — pasting is disabled",
      }
    : {};

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={account ? "Edit Account" : "Add New Account"}
      confirmLabel={account ? "Save Account" : "Create Account"}
      onConfirm={submit}
      size="md"
    >
      <FormProvider {...form}>
        <div className="space-y-5 pb-2">
          <FormSelect
            name="bankName"
            label="Bank Name"
            required
            placeholder="Select bank..."
            options={BANK_OPTIONS}
            className="w-full"
          />

          <FormInput
            name="bankBranch"
            label="Bank Branch"
            required
            placeholder="e.g. Nasr City Branch"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="accountHolderName"
              label="Account Holder Name"
              required
            />
            <FormSelect
              name="accountType"
              label="Account Type"
              options={BANK_ACCOUNT_TYPE_OPTIONS}
              className="w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              name="country"
              label="Country"
              required
              placeholder="Select country..."
              options={BANK_COUNTRY_OPTIONS}
              className="w-full"
            />
            <FormSelect
              name="currency"
              label="Currency"
              required
              options={CURRENCY_OPTIONS}
              className="w-full"
            />
          </div>

          <FormInput name="phone" label="Phone" type="tel" />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="accountNumber"
              label="Account Number"
              required
              autoComplete="off"
            />
            <FormInput
              name="confirmAccountNumber"
              label="Confirm Account Number"
              required
              {...secureConfirmProps}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="iban"
              label="IBAN"
              required
              placeholder="EG00 0000..."
              autoComplete="off"
            />
            <FormInput
              name="confirmIban"
              label="Confirm IBAN"
              required
              {...secureConfirmProps}
            />
          </div>

          <FormInput name="swift" label="SWIFT / BIC" autoComplete="off" />

          {/* FE-047 — a frozen account stays on record but is unavailable for
              new settlement tickets. */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="isFrozen"
              checked={form.watch("isFrozen")}
              onCheckedChange={(checked) =>
                form.setValue("isFrozen", Boolean(checked), {
                  shouldValidate: true,
                })
              }
            />
            <Label
              htmlFor="isFrozen"
              className="cursor-pointer text-sm text-slate-700"
            >
              Freeze Account
            </Label>
          </div>
        </div>
      </FormProvider>
    </BaseModal>
  );
};

export default MerchantBankAccountDialog;
export { MerchantBankAccountDialog };
export type { MerchantBankAccountDialogProps };
