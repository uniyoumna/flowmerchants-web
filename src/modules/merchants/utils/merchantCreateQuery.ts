import {
  FIRST_MERCHANT_CREATE_STEP,
  MERCHANT_CREATE_QUERY_KEYS,
  MERCHANT_STEP_META,
} from "../constants";
import {
  isMerchantCreateStep,
  MERCHANT_CREATE_STEPS,
  type MerchantCreateQueryParams,
  type MerchantCreateStep,
  type MerchantStepState,
} from "../types";
import type { RawSearchParams } from "./merchantsQuery";

/** Route the wizard lives on — every step is a query variation of this path. */
const MERCHANT_CREATE_PATH = "/merchants/new";

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Reads the wizard position out of the URL. An unknown or missing step falls
 * back to step 1 rather than 404ing, so a hand-edited URL still renders.
 */
export function parseMerchantCreateSearchParams(
  searchParams: RawSearchParams = {},
): MerchantCreateQueryParams {
  const rawStep = firstValue(searchParams[MERCHANT_CREATE_QUERY_KEYS.step]);
  const rawDraftId = firstValue(
    searchParams[MERCHANT_CREATE_QUERY_KEYS.draftId],
  ).trim();

  return {
    step: isMerchantCreateStep(rawStep) ? rawStep : FIRST_MERCHANT_CREATE_STEP,
    draftId: rawDraftId || null,
  };
}

/** `{ step: "agreement", draftId: "M-1" }` → `/merchants/new?step=agreement&draftId=M-1` */
export function buildMerchantCreateHref({
  step,
  draftId,
}: MerchantCreateQueryParams): string {
  const params = new URLSearchParams({
    [MERCHANT_CREATE_QUERY_KEYS.step]: step,
  });

  if (draftId) {
    params.set(MERCHANT_CREATE_QUERY_KEYS.draftId, draftId);
  }

  return `${MERCHANT_CREATE_PATH}?${params.toString()}`;
}

/**
 * Opens an existing merchant in the wizard at step 1, with every step loaded
 * from what was already saved (US-003).
 *
 * This is the draft/resume path. Editing an *approved* merchant is a different
 * flow — it has to create a pending version for re-approval (FE-063) — and will
 * get its own entry point when that lands.
 */
export function buildMerchantEditHref(merchantId: string): string {
  return buildMerchantCreateHref({
    step: FIRST_MERCHANT_CREATE_STEP,
    draftId: merchantId,
  });
}

/** The step before / after `step`, or `null` at either end of the wizard. */
export function getAdjacentStep(
  step: MerchantCreateStep,
  direction: "next" | "previous",
): MerchantCreateStep | null {
  const index = MERCHANT_CREATE_STEPS.indexOf(step);
  const target = direction === "next" ? index + 1 : index - 1;

  return MERCHANT_CREATE_STEPS[target] ?? null;
}

/**
 * Everything before the current step counts as completed — the wizard only
 * advances after a successful save, so position in the URL *is* progress.
 */
export function getStepState(
  step: MerchantCreateStep,
  currentStep: MerchantCreateStep,
): MerchantStepState {
  const order = MERCHANT_STEP_META[step].order;
  const currentOrder = MERCHANT_STEP_META[currentStep].order;

  if (order < currentOrder) return "completed";
  if (order === currentOrder) return "current";
  return "pending";
}

/** Stable identity for a step view — used as the `<Suspense>` key. */
export function serializeMerchantCreateQuery(
  query: MerchantCreateQueryParams,
): string {
  return `${query.step}|${query.draftId ?? "new"}`;
}

export { MERCHANT_CREATE_PATH };
