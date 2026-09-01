import {
  MERCHANT_CREATE_STEPS,
  type MerchantCreateStep,
  type MerchantStatus,
} from "../types";

/**
 * ⚠️ TEMPORARY — in-memory stand-in for the merchant draft endpoints.
 *
 * It exists so the wizard can be built and demoed end to end before the backend
 * is ready: saving a step persists it for the life of the server process, and
 * navigating back re-reads it exactly as a real GET would. Delete this file and
 * flip `USE_MOCK_STEP_API` in `merchantCreateService.ts` at integration time.
 */

type StoredStep = Record<string, unknown>;
type StoredDraft = Partial<Record<MerchantCreateStep, StoredStep>> & {
  /** Set once the application is submitted for review (FE-051). */
  status?: MerchantStatus;
};

/**
 * Parked on `globalThis` so the drafts survive Next.js hot reloads — a plain
 * module-level Map is rebuilt on every edit, which loses the draft mid-demo.
 */
const globalStore = globalThis as typeof globalThis & {
  __flowMerchantDrafts?: Map<string, StoredDraft>;
  __flowMerchantDraftSeq?: number;
};

if (!globalStore.__flowMerchantDrafts) {
  globalStore.__flowMerchantDrafts = new Map<string, StoredDraft>();
}

const drafts = globalStore.__flowMerchantDrafts;

/** Keys the API returns as arrays even when only one value was submitted. */
const LIST_KEYS = new Set(["business_types", "assigned_products"]);

/** Inline previews stay readable up to this size; larger files store a path. */
const MAX_INLINE_PREVIEW_BYTES = 1024 * 1024;

const MOCK_LATENCY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nextDraftId(): string {
  globalStore.__flowMerchantDraftSeq =
    (globalStore.__flowMerchantDraftSeq ?? 0) + 1;

  const sequence = String(globalStore.__flowMerchantDraftSeq).padStart(4, "0");
  return `MER-${new Date().getFullYear()}-${sequence}`;
}

/**
 * Stands in for object storage. Small files become data URLs so the re-opened
 * step shows a real preview; anything larger keeps a plausible URL, which
 * `BaseFileUpload` renders as a named file rather than a broken image.
 */
async function toStoredFile(file: File): Promise<string> {
  if (file.size > MAX_INLINE_PREVIEW_BYTES) {
    return `https://mock.flow.local/uploads/${encodeURIComponent(file.name)}`;
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  return `data:${file.type};base64,${base64}`;
}

/** FormData → the JSON object the real endpoint would echo back. */
async function toStoredStep(formData: FormData): Promise<StoredStep> {
  const stored: StoredStep = {};

  for (const key of new Set(formData.keys())) {
    const values = formData.getAll(key);

    if (LIST_KEYS.has(key)) {
      stored[key] = values.map(String);
      continue;
    }

    const value = values[0];
    stored[key] =
      value instanceof File ? await toStoredFile(value) : String(value);
  }

  return stored;
}

/**
 * Persists one step. A missing `draftId` mints a new immutable merchant ID,
 * mirroring FE-004 ("unique merchant ID when the first draft is saved").
 *
 * Previously stored keys are kept when the new submission omits them, so an
 * untouched file field does not wipe the stored upload.
 */
export async function mockSaveStep(
  draftId: string | null,
  step: MerchantCreateStep,
  formData: FormData,
): Promise<{ draftId: string; data: StoredStep }> {
  await delay(MOCK_LATENCY_MS);

  const id = draftId ?? nextDraftId();
  const draft = drafts.get(id) ?? {};
  const incoming = await toStoredStep(formData);

  const merged = { ...draft[step], ...incoming };
  drafts.set(id, { ...draft, [step]: merged });

  return { draftId: id, data: merged };
}

/** Reads one saved step back, or `null` when the step was never submitted. */
export async function mockGetStep(
  draftId: string,
  step: MerchantCreateStep,
): Promise<StoredStep | null> {
  await delay(MOCK_LATENCY_MS);

  return drafts.get(draftId)?.[step] ?? null;
}

/**
 * Stands in for `POST /merchants/{id}/submit/`.
 *
 * Enforces the completeness rule (FE-035) the same way the backend will: an
 * application only reaches compliance once every step has been saved, and the
 * steps that are still missing come back so the UI can name them.
 */
export async function mockSubmitDraft(
  draftId: string,
): Promise<{ success: boolean; missingSteps: MerchantCreateStep[] }> {
  await delay(MOCK_LATENCY_MS);

  const draft = drafts.get(draftId);
  const missingSteps = MERCHANT_CREATE_STEPS.filter((step) => !draft?.[step]);

  if (missingSteps.length > 0) {
    return { success: false, missingSteps };
  }

  drafts.set(draftId, { ...draft, status: "pending_compliance_review" });

  return { success: true, missingSteps: [] };
}
