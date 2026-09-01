"use server";

import { revalidatePath } from "next/cache";
import {
  approveComplianceCase,
  rejectComplianceCase,
} from "@/modules/merchants/services/complianceService";
import type { ComplianceDecisionResult } from "@/modules/merchants/types";

/**
 * Records a compliance decision.
 *
 * These run as Server Actions rather than browser fetches because the access
 * token lives in an `httpOnly` cookie — a request made from the client would go
 * out unauthenticated (see `headerBuilder.ts`).
 *
 * A decided case leaves the queue and changes the merchant's status, so both
 * screens are revalidated; the caller navigates once the action resolves.
 */
export async function approveComplianceCaseAction(
  caseId: string,
): Promise<ComplianceDecisionResult> {
  const result = await approveComplianceCase(caseId);

  if (result.success) {
    revalidatePath("/merchants/compliance");
    revalidatePath("/merchants");
  }

  return result;
}

export async function rejectComplianceCaseAction(
  caseId: string,
  reason?: string,
): Promise<ComplianceDecisionResult> {
  const result = await rejectComplianceCase(caseId, reason);

  if (result.success) {
    revalidatePath("/merchants/compliance");
    revalidatePath("/merchants");
  }

  return result;
}
