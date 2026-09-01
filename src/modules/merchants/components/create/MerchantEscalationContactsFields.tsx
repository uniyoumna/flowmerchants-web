"use client";

import { Minus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/form";
import { ESCALATION_LEVEL_OPTIONS } from "../../constants";
import {
  EMPTY_ESCALATION_CONTACT,
  type MerchantContactsValues,
} from "../../schemas/merchantContactsSchema";
import { fieldArrayErrorMessage } from "../../utils/fieldArrayError";
import { MerchantAddRowButton } from "./MerchantAddRowButton";
import { MerchantStepFieldset } from "./MerchantStepFieldset";

/** FE-021 — one or more complaint-escalation contacts, one row per tier. */
const MerchantEscalationContactsFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<MerchantContactsValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "escalationContacts",
  });

  const arrayError = fieldArrayErrorMessage(errors.escalationContacts);

  return (
    <MerchantStepFieldset
      title="Complaint Escalation Contacts"
      description="One or more contacts by escalation level"
    >
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative rounded-xl border border-slate-100 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <FormInput
                name={`escalationContacts.${index}.fullName`}
                label="Full name"
              />
              <FormInput
                name={`escalationContacts.${index}.role`}
                label="Role / title"
              />
              <FormInput
                name={`escalationContacts.${index}.email`}
                label="Email"
                type="email"
              />
              <FormInput
                name={`escalationContacts.${index}.phone`}
                label="Phone Number"
                type="tel"
              />

              <div className="flex items-start gap-2">
                <FormSelect
                  name={`escalationContacts.${index}.level`}
                  label="Escalation Level"
                  options={ESCALATION_LEVEL_OPTIONS}
                  containerClassName="flex-1"
                />

                {/* The first row is the minimum the schema allows, so it has
                    nothing to remove. */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove escalation contact ${index + 1}`}
                    className="mt-7 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    <Minus className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {arrayError && (
        <p className="text-xs text-destructive" role="alert">
          {arrayError}
        </p>
      )}

      <MerchantAddRowButton
        label="Add Contact"
        onClick={() => append({ ...EMPTY_ESCALATION_CONTACT })}
      />
    </MerchantStepFieldset>
  );
};

export default MerchantEscalationContactsFields;
export { MerchantEscalationContactsFields };
