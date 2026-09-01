"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { submitMerchantConfigAction } from "../actions/financeActions";
import {
  MERCHANT_CONFIG_DEFAULTS,
  type MerchantConfigValues,
  merchantConfigSchema,
} from "../schemas/merchantConfigSchema";

type UseMerchantConfigFormOptions = {
  workflowId: string;
  /** Saved parameters, or `null` for a merchant not configured yet. */
  savedConfig: Record<string, unknown> | null;
};

/**
 * Owns validation, submission and navigation for the configuration form.
 *
 * A saved configuration is merged over the defaults rather than replacing them,
 * so a backend that has not started returning a field yet leaves that control
 * on its default instead of rendering an empty radio group.
 */
export function useMerchantConfigForm({
  workflowId,
  savedConfig,
}: UseMerchantConfigFormOptions) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<MerchantConfigValues>({
    resolver: zodResolver(
      merchantConfigSchema,
    ) as Resolver<MerchantConfigValues>,
    defaultValues: {
      ...MERCHANT_CONFIG_DEFAULTS,
      ...(savedConfig ?? {}),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    const result = await submitMerchantConfigAction(workflowId, values);

    if (!result.success) {
      const message = result.error ?? "Could not save this configuration.";
      setServerError(message);
      toast.error(message);
      return;
    }

    toast.success("Configuration submitted.");
    router.push("/finance/configuration");
  });

  return {
    form,
    control: form.control,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    serverError,
    /** Drives the conditional day inputs under the refund-window checkbox. */
    hasRefundWindow: form.watch("hasRefundWindow"),
    refundEnabled: form.watch("refundEnabled"),
  };
}
