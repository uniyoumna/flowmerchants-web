"use client";

import { Download } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { exportPaymentFileAction } from "../../actions/settlementsActions";
import type { SettlementsQueryParams } from "../../types";

type SettlementsExportButtonProps = {
  /** Exports what the filters currently select, not the whole table. */
  query: SettlementsQueryParams;
};

const SettlementsExportButton = ({ query }: SettlementsExportButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const exportFile = () => {
    startTransition(async () => {
      const result = await exportPaymentFileAction(query);

      if (!result.success || !result.fileUrl) {
        toast.error(result.error ?? "Could not build the payment file.");
        return;
      }

      // The backend returns a storage URL rather than the bytes, so the browser
      // fetches the file directly instead of proxying it through the app.
      window.location.assign(result.fileUrl);
    });
  };

  return (
    <button
      type="button"
      onClick={exportFile}
      disabled={isPending}
      className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Download className="size-4" />
      {isPending ? "Preparing..." : "Export Payment File"}
    </button>
  );
};

export default SettlementsExportButton;
export { SettlementsExportButton };
export type { SettlementsExportButtonProps };
