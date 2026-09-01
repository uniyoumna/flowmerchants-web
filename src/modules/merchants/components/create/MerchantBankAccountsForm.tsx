"use client";

import { useState } from "react";
import { FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { DeleteConfirmModal } from "@/components/table/DeleteConfirmModal";
import { useMerchantStepForm } from "../../hooks/useMerchantStepForm";
import {
  type BankAccountValues,
  MERCHANT_BANK_ACCOUNTS_DEFAULTS,
  type MerchantBankAccountsValues,
  merchantBankAccountsSchema,
} from "../../schemas/merchantBankAccountsSchema";
import { fieldArrayErrorMessage } from "../../utils/fieldArrayError";
import { buildBankAccountsFormData } from "../../utils/merchantStepMappers";
import { MerchantAddRowButton } from "./MerchantAddRowButton";
import { MerchantBankAccountCard } from "./MerchantBankAccountCard";
import { MerchantBankAccountDialog } from "./MerchantBankAccountDialog";
import { MerchantCreateFooter } from "./MerchantCreateFooter";

type MerchantBankAccountsFormProps = {
  draftId: string | null;
  defaultValues: MerchantBankAccountsValues;
};

/** Index of the row a dialog is acting on; `"new"` when adding. */
type DialogTarget = number | "new" | null;

/** Step 4 — Bank Accounts (US-013 … US-015, FE-039 … FE-046). */
const MerchantBankAccountsForm = ({
  draftId,
  defaultValues,
}: MerchantBankAccountsFormProps) => {
  const {
    form,
    handleSubmit,
    isSubmitting,
    serverError,
    goToPreviousStep,
    hasPreviousStep,
    isLastStep,
  } = useMerchantStepForm<MerchantBankAccountsValues>({
    step: "bank",
    draftId,
    schema: merchantBankAccountsSchema,
    defaultValues: defaultValues ?? MERCHANT_BANK_ACCOUNTS_DEFAULTS,
    toFormData: buildBankAccountsFormData,
  });

  const { control, setValue, formState } = form;
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "accounts",
  });

  const accounts = useWatch({ control, name: "accounts" }) ?? [];

  const [dialogTarget, setDialogTarget] = useState<DialogTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const arrayError = fieldArrayErrorMessage(formState.errors.accounts);

  /** Makes `index` the sole default for its currency (FE-046). */
  function setDefaultFor(index: number, currency: string) {
    accounts.forEach((account, i) => {
      if (account.currency !== currency) return;
      setValue(`accounts.${i}.isDefault`, i === index, {
        shouldValidate: true,
      });
    });
  }

  function saveAccount(values: BankAccountValues) {
    if (dialogTarget === "new") {
      // The first account of a currency becomes its default automatically —
      // otherwise the step could never satisfy FE-046 without extra clicks.
      const isFirstOfCurrency = !accounts.some(
        (account) => account.currency === values.currency,
      );

      append({ ...values, isDefault: isFirstOfCurrency && !values.isFrozen });
      return;
    }

    if (typeof dialogTarget === "number") {
      update(dialogTarget, values);
    }
  }

  function confirmDelete() {
    if (pendingDelete === null) return;

    const removed = accounts[pendingDelete];
    remove(pendingDelete);
    setPendingDelete(null);

    // Deleting the default would leave its currency without one, so the first
    // remaining usable account for that currency inherits it.
    if (!removed?.isDefault) return;

    const heir = accounts.findIndex(
      (account, i) =>
        i !== pendingDelete &&
        account.currency === removed.currency &&
        !account.isFrozen,
    );

    if (heir >= 0) {
      const shifted = heir > pendingDelete ? heir - 1 : heir;
      setValue(`accounts.${shifted}.isDefault`, true, { shouldValidate: true });
    }
  }

  const editing =
    typeof dialogTarget === "number" ? (accounts[dialogTarget] ?? null) : null;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:p-8">
          <h3 className="text-base font-semibold text-slate-900">
            Bank Accounts
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Register one or more settlement bank accounts.
          </p>

          {fields.length > 0 && (
            <div className="mt-5 space-y-4">
              {fields.map((field, index) => {
                const account = accounts[index];
                if (!account) return null;

                return (
                  <MerchantBankAccountCard
                    key={field.id}
                    account={account}
                    index={index}
                    canDelete={fields.length > 1}
                    onEdit={() => setDialogTarget(index)}
                    onDelete={() => setPendingDelete(index)}
                    onSetDefault={() => setDefaultFor(index, account.currency)}
                  />
                );
              })}
            </div>
          )}

          {arrayError && (
            <p className="mt-4 text-xs text-destructive" role="alert">
              {arrayError}
            </p>
          )}

          <div className="mt-5 border-t border-slate-50 pt-4">
            <MerchantAddRowButton
              label="Add Account"
              onClick={() => setDialogTarget("new")}
            />
          </div>
        </div>

        {serverError && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}

        <MerchantCreateFooter
          hasPreviousStep={hasPreviousStep}
          onPrevious={goToPreviousStep}
          isSubmitting={isSubmitting}
          isLastStep={isLastStep}
        />
      </form>

      <MerchantBankAccountDialog
        isOpen={dialogTarget !== null}
        onClose={() => setDialogTarget(null)}
        account={editing}
        onSubmit={saveAccount}
      />

      <DeleteConfirmModal
        isOpen={pendingDelete !== null}
        title="Delete this bank account?"
        description="The account will be removed from this merchant's settlement routing. You can add it again later."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </FormProvider>
  );
};

export default MerchantBankAccountsForm;
export { MerchantBankAccountsForm };
export type { MerchantBankAccountsFormProps };
