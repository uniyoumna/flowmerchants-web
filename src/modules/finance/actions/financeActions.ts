"use server";

import { revalidatePath } from "next/cache";
import type { MerchantConfigValues } from "@/modules/finance/schemas/merchantConfigSchema";
import { submitMerchantConfig } from "@/modules/finance/services/financeService";
import type { ConfigSubmitResult } from "@/modules/finance/types";

/**
 * Saves a merchant's financial configuration.
 *
 * This runs as a Server Action rather than a browser fetch because the access
 * token lives in an `httpOnly` cookie — a request made from the client would go
 * out unauthenticated (see `headerBuilder.ts`).
 */
export async function submitMerchantConfigAction(
  workflowId: string,
  values: MerchantConfigValues,
): Promise<ConfigSubmitResult> {
  const result = await submitMerchantConfig(workflowId, values);

  // A configured merchant leaves the queue and can start transacting.
  if (result.success) {
    revalidatePath("/finance/configuration");
    revalidatePath("/merchants");
  }

  return result;
}
