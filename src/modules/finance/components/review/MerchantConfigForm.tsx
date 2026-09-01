"use client";

import { Download } from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";
import { FormInput } from "@/components/form/FormInput";
import { FormRadioGroup } from "@/components/form/FormRadioGroup";
import { FormToggle } from "@/components/form/FormToggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  CAP_PERIOD_OPTIONS,
  CYCLE_FREQUENCY_OPTIONS,
  CYCLE_TYPE_OPTIONS,
  FEE_COLLECTED_FROM_OPTIONS,
  FEE_ELIGIBILITY_TOGGLES,
  FEE_TYPE_OPTIONS,
  REBATE_STRUCTURE_OPTIONS,
  REBATE_VALUE_TYPE_OPTIONS,
  REFUND_TYPE_OPTIONS,
} from "../../constants";
import { useMerchantConfigForm } from "../../hooks/useMerchantConfigForm";
import type { MerchantConfigDetail } from "../../types";
import { ComplianceAgreementCard } from "./ComplianceAgreementCard";
import { ConfigCard } from "./ConfigCard";

type MerchantConfigFormProps = {
  detail: MerchantConfigDetail;
};

/** The percent suffix shown inside percentage inputs. */
const PercentSuffix = () => <span className="text-sm text-slate-400">%</span>;

const MerchantConfigForm = ({ detail }: MerchantConfigFormProps) => {
  const {
    form,
    control,
    onSubmit,
    isSubmitting,
    serverError,
    hasRefundWindow,
    refundEnabled,
  } = useMerchantConfigForm({
    workflowId: detail.id,
    savedConfig: detail.config,
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex-1 px-6 py-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* ─── Form column ─── */}
          <div className="min-w-0 flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Finance Report
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure financial parameters for this merchant
              </p>
            </div>

            {/* ─── 1. Settlement cycle ─── */}
            <ConfigCard title="Settlement Cycle">
              <FormRadioGroup
                control={control}
                name="cycleType"
                label="Cycle Type"
                options={CYCLE_TYPE_OPTIONS}
              />

              <FormRadioGroup
                control={control}
                name="frequency"
                label="Frequency"
                options={CYCLE_FREQUENCY_OPTIONS}
              />

              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="hasRefundWindow"
                  checked={hasRefundWindow === true}
                  onCheckedChange={(checked) =>
                    form.setValue("hasRefundWindow", checked === true, {
                      shouldValidate: true,
                    })
                  }
                />
                <Label
                  htmlFor="hasRefundWindow"
                  className="cursor-pointer text-sm font-medium text-slate-700"
                >
                  Have Refund Window
                </Label>
              </div>

              {/* The bounds only exist when the merchant has a window, so they
                  are hidden rather than disabled when the box is unchecked. */}
              {hasRefundWindow && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    control={control}
                    name="refundWindowMin"
                    label="Minimum (day)"
                    inputMode="numeric"
                  />
                  <FormInput
                    control={control}
                    name="refundWindowMax"
                    label="Maximum (day)"
                    inputMode="numeric"
                  />
                </div>
              )}
            </ConfigCard>

            {/* ─── 2. Fee configuration ─── */}
            <ConfigCard title="Fee Configuration">
              <FormRadioGroup
                control={control}
                name="feeType"
                label="Fee Type"
                options={FEE_TYPE_OPTIONS}
              />

              <FormInput
                control={control}
                name="feeValue"
                label="Percentage"
                placeholder="Enter Percentage"
                inputMode="decimal"
                endIcon={<PercentSuffix />}
              />

              <FormRadioGroup
                control={control}
                name="collectedFrom"
                label="Collected From"
                options={FEE_COLLECTED_FROM_OPTIONS}
              />

              <FormInput
                control={control}
                name="maxRefundOrders"
                label="Max Refund Orders"
                placeholder="Enter Number"
                inputMode="numeric"
                endIcon={<PercentSuffix />}
              />

              <FormRadioGroup
                control={control}
                name="capPeriod"
                label="Cap Period"
                options={CAP_PERIOD_OPTIONS}
              />
            </ConfigCard>

            {/* ─── 3. Refund configuration ─── */}
            <ConfigCard
              title="Refund Configurations"
              icon={<Download className="size-4.5 text-slate-500" />}
              action={
                <FormToggle
                  control={control}
                  name="refundEnabled"
                  ariaLabel="Enable refund configuration"
                />
              }
            >
              {refundEnabled ? (
                <FormRadioGroup
                  control={control}
                  name="refundType"
                  label="Refund Type"
                  options={REFUND_TYPE_OPTIONS}
                />
              ) : (
                <p className="text-sm text-slate-400">
                  Refunds are switched off for this merchant.
                </p>
              )}
            </ConfigCard>

            {/* ─── 4. Rebate configuration ─── */}
            <ConfigCard title="Rebate Configuration">
              <FormRadioGroup
                control={control}
                name="rebateStructure"
                label="Rebate Structure"
                options={REBATE_STRUCTURE_OPTIONS}
              />

              <FormRadioGroup
                control={control}
                name="rebateValueType"
                label="Rebate Value Type"
                options={REBATE_VALUE_TYPE_OPTIONS}
              />

              <FormInput
                control={control}
                name="rebateValue"
                label="Rebate Value"
                placeholder="Enter value"
                inputMode="decimal"
                endIcon={<PercentSuffix />}
              />
            </ConfigCard>

            {/* ─── 5. Fee eligibility ─── */}
            <ConfigCard title="Fee Eligibility">
              <div className="divide-y divide-slate-100">
                {FEE_ELIGIBILITY_TOGGLES.map((toggle) => (
                  <FormToggle
                    key={toggle.name}
                    control={control}
                    name={toggle.name}
                    title={toggle.title}
                    description={toggle.description}
                    className="py-4 first:pt-0 last:pb-0"
                  />
                ))}
              </div>
            </ConfigCard>

            {serverError && (
              <p className="text-sm font-medium text-rose-600">{serverError}</p>
            )}
          </div>

          {/* ─── Compliance sign-off — pinned just below the header so it
                  stays readable while the form scrolls past it ─── */}
          <div className="lg:sticky lg:top-[calc(var(--config-header)+1.5rem)] lg:w-80 lg:shrink-0">
            <ComplianceAgreementCard document={detail.complianceAgreement} />
          </div>
        </div>
      </div>

      {/* ─── Submit bar ─── */}
      <div className="sticky bottom-0 z-30 flex items-center justify-end border-t border-slate-100 bg-white px-6 py-4 lg:px-8">
        <BaseButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          className="h-11 rounded-xl bg-[#7C3AED] px-10 font-semibold text-white hover:bg-[#6D28D9]"
        >
          Submit
        </BaseButton>
      </div>
    </form>
  );
};

export default MerchantConfigForm;
export { MerchantConfigForm };
export type { MerchantConfigFormProps };
