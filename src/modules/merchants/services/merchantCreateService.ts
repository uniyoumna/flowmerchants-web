import { customFetch } from "@/utils/fetch";
import { MERCHANT_STEP_META } from "../constants";
import type {
  MerchantCreateStep,
  MerchantStepData,
  MerchantStepSaveResult,
  MerchantSubmitResult,
} from "../types";
import {
  mockGetStep,
  mockSaveStep,
  mockSubmitDraft,
} from "./merchantDraftMockStore";

/**
 * Merchant onboarding — one endpoint per wizard step.
 *
 * Every call is written against the real contract already; only the transport
 * is stubbed. To integrate, set `USE_MOCK_STEP_API` to `false` and delete
 * `merchantDraftMockStore.ts` — no call site changes.
 */

// TODO: flip to `false` once the merchant draft endpoints are deployed.
const USE_MOCK_STEP_API = true;

const MERCHANTS_ENDPOINT = "/api/v1/merchants/merchants/";

/** Sub-resource each step writes to, hung off a single merchant draft. */
const STEP_RESOURCES: Record<MerchantCreateStep, string> = {
  general: "",
  agreement: "agreement/",
  contacts: "operational-contacts/",
  bank: "bank-accounts/",
  commercial: "commercial-config/",
};

/**
 * Step 1 without a draft is a create (`POST /merchants/`); everything else
 * targets an existing draft, so it is a partial update of a sub-resource.
 */
function stepEndpoint(
  step: MerchantCreateStep,
  draftId: string | null,
): string {
  if (!draftId) return MERCHANTS_ENDPOINT;
  return `${MERCHANTS_ENDPOINT}${draftId}/${STEP_RESOURCES[step]}`;
}

/**
 * Saves one step and returns the draft ID to carry into the next one.
 *
 * The payload is `FormData` on every step: steps 1, 2 and 4 carry uploads, and
 * a single content type keeps the endpoints uniform.
 */
export async function saveMerchantStep({
  step,
  draftId,
  formData,
}: {
  step: MerchantCreateStep;
  draftId: string | null;
  formData: FormData;
}): Promise<MerchantStepSaveResult> {
  if (USE_MOCK_STEP_API) {
    const { draftId: savedId } = await mockSaveStep(draftId, step, formData);
    return { success: true, draftId: savedId, message: null };
  }

  const endpoint = stepEndpoint(step, draftId);

  // A draft that does not exist yet is created; an existing one is patched, so
  // re-saving a step the user came back to never duplicates the record.
  const request = draftId
    ? customFetch.patch<{ id: string }>(endpoint, formData, {
        cache: "no-store",
      })
    : customFetch.post<{ id: string }>(endpoint, formData, {
        cache: "no-store",
      });

  const { data, error } = await request;

  if (error) {
    return { success: false, draftId, message: error };
  }

  return { success: true, draftId: data?.id ?? draftId, message: null };
}

/**
 * Reads a previously saved step so the user can review and edit it (US-003).
 * A draft that has never reached this step resolves to `null`, which the form
 * renders as its blank defaults.
 */
export async function fetchMerchantStep({
  step,
  draftId,
}: {
  step: MerchantCreateStep;
  draftId: string | null;
}): Promise<{ data: MerchantStepData; error: string | null }> {
  if (!draftId) return { data: null, error: null };

  if (USE_MOCK_STEP_API) {
    return { data: await mockGetStep(draftId, step), error: null };
  }

  const { data, error } = await customFetch.get<Record<string, unknown>>(
    stepEndpoint(step, draftId),
    { cache: "no-store" },
  );

  if (error) {
    return { data: null, error };
  }

  return { data: data ?? null, error: null };
}

/**
 * Submits the finished application for compliance review (FE-051).
 *
 * Completeness is enforced here rather than by gating the stepper: the user can
 * fill the steps in any order, and only the submit call decides whether the
 * application is whole (FE-035).
 */
export async function submitMerchantApplication({
  draftId,
}: {
  draftId: string;
}): Promise<MerchantSubmitResult> {
  if (USE_MOCK_STEP_API) {
    const { success, missingSteps } = await mockSubmitDraft(draftId);

    if (!success) {
      const names = missingSteps
        .map((step) => MERCHANT_STEP_META[step].label)
        .join(", ");

      return {
        success: false,
        message: `Complete these steps before submitting: ${names}.`,
        missingSteps,
      };
    }

    return { success: true, message: null };
  }

  const { error } = await customFetch.post<{ status: string }>(
    `${MERCHANTS_ENDPOINT}${draftId}/submit/`,
    {},
    { cache: "no-store" },
  );

  if (error) {
    return { success: false, message: error };
  }

  return { success: true, message: null };
}
