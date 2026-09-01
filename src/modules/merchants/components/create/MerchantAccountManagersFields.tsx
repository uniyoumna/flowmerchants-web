"use client";

import { Minus } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form";
import { cn } from "@/lib/utils";
import {
  EMPTY_ACCOUNT_MANAGER,
  type MerchantContactsValues,
} from "../../schemas/merchantContactsSchema";
import { fieldArrayErrorMessage } from "../../utils/fieldArrayError";
import { MerchantAddRowButton } from "./MerchantAddRowButton";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** FE-022 — account managers, exactly one of which is primary. */
const MerchantAccountManagersFields = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<MerchantContactsValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accountManagers",
  });

  const managers = useWatch({ control, name: "accountManagers" });
  const arrayError = fieldArrayErrorMessage(errors.accountManagers);

  /** Primary is exclusive, so selecting one clears the rest. */
  function setPrimary(index: number) {
    fields.forEach((_, i) => {
      setValue(`accountManagers.${i}.isPrimary`, i === index, {
        shouldValidate: true,
      });
    });
  }

  function removeManager(index: number) {
    const wasPrimary = managers?.[index]?.isPrimary;
    remove(index);

    // Removing the primary would leave the merchant without one, so the first
    // remaining manager inherits it.
    if (wasPrimary) {
      setValue("accountManagers.0.isPrimary", true, { shouldValidate: true });
    }
  }

  return (
    <MerchantStepFieldset
      title="Account Managers"
      description="Mark exactly one as Primary Account Manager"
    >
      <div className="space-y-4">
        {fields.map((field, index) => {
          const isPrimary = Boolean(managers?.[index]?.isPrimary);

          return (
            <div
              key={field.id}
              className={cn(
                "rounded-xl border p-4 transition-colors",
                isPrimary
                  ? "border-purple-200 bg-purple-50/30"
                  : "border-slate-100",
              )}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput
                  name={`accountManagers.${index}.fullName`}
                  label="Full name"
                />
                <FormInput
                  name={`accountManagers.${index}.email`}
                  label="Email"
                  type="email"
                />
                <FormInput
                  name={`accountManagers.${index}.phone`}
                  label="Phone Number"
                  type="tel"
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="radio"
                    name="primaryAccountManager"
                    checked={isPrimary}
                    onChange={() => setPrimary(index)}
                    className="size-4 cursor-pointer accent-[#7C3AED]"
                  />
                  Primary Account Manager
                </label>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeManager(index)}
                    aria-label={`Remove account manager ${index + 1}`}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    <Minus className="size-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {arrayError && (
        <p className="text-xs text-destructive" role="alert">
          {arrayError}
        </p>
      )}

      <MerchantAddRowButton
        label="Add Manager"
        onClick={() => append({ ...EMPTY_ACCOUNT_MANAGER })}
      />
    </MerchantStepFieldset>
  );
};

export default MerchantAccountManagersFields;
export { MerchantAccountManagersFields };
