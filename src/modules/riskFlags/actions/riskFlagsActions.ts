"use server";

import { revalidatePath } from "next/cache";
import {
  blockRiskFlagMerchant,
  resolveRiskFlagCase,
} from "@/modules/riskFlags/services/riskFlagsService";
import type { RiskFlagActionResult } from "@/modules/riskFlags/types";

/**
 * Risk decisions run as Server Actions rather than browser fetches: the access
 * token lives in an `httpOnly` cookie, so a request made from the client would
 * go out unauthenticated (see `headerBuilder.ts`).
 */
export async function blockRiskFlagMerchantAction(
  caseId: string,
): Promise<RiskFlagActionResult> {
  const result = await blockRiskFlagMerchant(caseId);

  // Blocking suspends purchases, which changes the merchant's status too.
  if (result.success) {
    revalidatePath("/risk-flag");
    revalidatePath("/merchants");
  }

  return result;
}

export async function resolveRiskFlagCaseAction(
  caseId: string,
): Promise<RiskFlagActionResult> {
  const result = await resolveRiskFlagCase(caseId);

  if (result.success) {
    revalidatePath("/risk-flag");
  }

  return result;
}
