"use server";

import { revalidatePath } from "next/cache";
import {
  saveMerchantStep,
  submitMerchantApplication,
} from "@/modules/merchants/services/merchantCreateService";
import type {
  MerchantCreateStep,
  MerchantStepSaveResult,
  MerchantSubmitResult,
} from "@/modules/merchants/types";

/**
 * Saves one wizard step.
 *
 * This runs as a Server Action rather than a browser fetch because the access
 * token lives in an `httpOnly` cookie — a request made from the client would go
 * out unauthenticated (see `headerBuilder.ts`). `FormData` crosses the action
 * boundary natively, so uploads need no extra encoding.
 */
export async function saveMerchantStepAction(
  step: MerchantCreateStep,
  draftId: string | null,
  formData: FormData,
): Promise<MerchantStepSaveResult> {
  return saveMerchantStep({ step, draftId, formData });
}

/**
 * Submits the completed draft for compliance review (FE-051).
 *
 * The merchants list is revalidated so the newly submitted application shows up
 * with its `pending_compliance_review` status when the wizard redirects there.
 */
export async function submitMerchantApplicationAction(
  draftId: string,
): Promise<MerchantSubmitResult> {
  const result = await submitMerchantApplication({ draftId });

  if (result.success) {
    revalidatePath("/merchants");
  }

  return result;
}
