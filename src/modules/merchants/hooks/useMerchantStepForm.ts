"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { ZodType } from "zod";
import {
  saveMerchantStepAction,
  submitMerchantApplicationAction,
} from "../actions/merchantCreateActions";
import { MERCHANT_STEP_META } from "../constants";
import type { MerchantCreateStep } from "../types";
import {
  buildMerchantCreateHref,
  getAdjacentStep,
} from "../utils/merchantCreateQuery";

type UseMerchantStepFormOptions<TValues extends FieldValues> = {
  step: MerchantCreateStep;
  /** `null` until step 1 is saved and the backend mints the merchant ID. */
  draftId: string | null;
  schema: ZodType<unknown, TValues>;
  /** Saved values for this step, or the blank defaults for a fresh one. */
  defaultValues: TValues;
  /** Turns validated values into the multipart body for this step. */
  toFormData: (values: TValues) => FormData;
};

/**
 * The shared engine behind every wizard step: validate, save to that step's
 * endpoint, then advance the URL.
 *
 * A step is only marked complete by moving forward, so the position in the URL
 * always reflects data the backend has actually accepted. Going back does not
 * re-save — the server copy stays authoritative and is re-fetched on arrival.
 */
function useMerchantStepForm<TValues extends FieldValues>({
  step,
  draftId,
  schema,
  defaultValues,
  toFormData,
}: UseMerchantStepFormOptions<TValues>) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  // Navigation is separate from RHF's own submitting flag so the button stays
  // busy while the next step streams in, instead of flickering back to idle.
  const [isNavigating, startNavigation] = useTransition();

  const form = useForm<TValues>({
    resolver: zodResolver(schema) as Resolver<TValues>,
    defaultValues: defaultValues as DefaultValues<TValues>,
  });

  const previousStep = getAdjacentStep(step, "previous");
  const nextStep = getAdjacentStep(step, "next");

  async function onSubmit(values: TValues) {
    setServerError(null);

    const result = await saveMerchantStepAction(
      step,
      draftId,
      toFormData(values),
    );

    if (!result.success) {
      const message = result.message ?? "Could not save this step.";
      setServerError(message);
      toast.error(message);

      // Field-level backend errors land on the matching inputs (FE-079).
      for (const [field, error] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as Path<TValues>, {
          type: "server",
          message: error,
        });
      }

      return;
    }

    toast.success(`${MERCHANT_STEP_META[step].label} saved`);

    if (nextStep) {
      startNavigation(() => {
        router.push(
          buildMerchantCreateHref({ step: nextStep, draftId: result.draftId }),
        );
      });

      return;
    }

    // Last step: saving is only half of it — the application still has to be
    // handed to compliance, and that call is what enforces completeness
    const savedDraftId = result.draftId;

    if (!savedDraftId) {
      const message = "This draft has no merchant ID yet — save step 1 first.";
      setServerError(message);
      toast.error(message);

      return;
    }

    const submission = await submitMerchantApplicationAction(savedDraftId);

    if (!submission.success) {
      const message = submission.message ?? "Could not submit for review.";
      setServerError(message);
      toast.error(message);

      return;
    }

    toast.success("Application submitted for compliance review");

    startNavigation(() => {
      router.push(`/merchants/${savedDraftId}`);
    });
  }

  function goToPreviousStep() {
    if (!previousStep) return;

    startNavigation(() => {
      router.push(buildMerchantCreateHref({ step: previousStep, draftId }));
    });
  }

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting || isNavigating,
    serverError,
    goToPreviousStep,
    hasPreviousStep: previousStep !== null,
    isLastStep: nextStep === null,
  };
}

export { useMerchantStepForm };
export type { UseMerchantStepFormOptions };
