"use server";

import { revalidatePath } from "next/cache";
import {
  closeSettlementTicket,
  exportPaymentFile,
} from "@/modules/settlements/services/settlementsService";
import type {
  SettlementActionResult,
  SettlementsQueryParams,
} from "@/modules/settlements/types";

/**
 * Settlement mutations run as Server Actions rather than browser fetches: the
 * access token lives in an `httpOnly` cookie, so a request made from the client
 * would go out unauthenticated (see `headerBuilder.ts`).
 */
export async function closeSettlementTicketAction(
  ticketId: string,
): Promise<SettlementActionResult> {
  const result = await closeSettlementTicket(ticketId);

  // A closed ticket leaves the Due tab and changes the KPI totals.
  if (result.success) {
    revalidatePath("/settlements");
  }

  return result;
}

export async function exportPaymentFileAction(
  query: SettlementsQueryParams,
): Promise<SettlementActionResult> {
  return exportPaymentFile(query);
}
