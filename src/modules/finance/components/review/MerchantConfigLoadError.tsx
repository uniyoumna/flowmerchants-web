import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type MerchantConfigLoadErrorProps = {
  message: string;
};

/**
 * Shown when the workflow cannot be read. A workflow that does not exist is a
 * 404 instead — this is reserved for a real failure, so it offers a way back.
 */
const MerchantConfigLoadError = ({ message }: MerchantConfigLoadErrorProps) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-6">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-500" />

      <div>
        <p className="text-sm font-semibold text-rose-700">
          We could not load this configuration
        </p>
        <p className="mt-1 text-sm text-rose-600">{message}</p>

        <Link
          href="/finance/configuration"
          className="mt-3 inline-flex text-xs font-semibold text-rose-600 underline underline-offset-4 hover:text-rose-700"
        >
          Back to the configuration queue
        </Link>
      </div>
    </div>
  );
};

export default MerchantConfigLoadError;
export { MerchantConfigLoadError };
export type { MerchantConfigLoadErrorProps };
