import { AlertTriangle } from "lucide-react";
import Link from "next/link";

type MerchantDetailLoadErrorProps = {
  message: string;
};

/**
 * Shown when the merchant record itself cannot be read. A merchant that simply
 * does not exist is a 404 instead — this is reserved for a real failure, so it
 * offers a way back rather than implying the merchant is gone.
 */
const MerchantDetailLoadError = ({ message }: MerchantDetailLoadErrorProps) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-6">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-500" />

      <div>
        <p className="text-sm font-semibold text-rose-700">
          We could not load this merchant
        </p>
        <p className="mt-1 text-sm text-rose-600">{message}</p>

        <Link
          href="/merchants"
          className="mt-3 inline-flex text-xs font-semibold text-rose-600 underline underline-offset-4 hover:text-rose-700"
        >
          Back to Merchants
        </Link>
      </div>
    </div>
  );
};

export default MerchantDetailLoadError;
export { MerchantDetailLoadError };
export type { MerchantDetailLoadErrorProps };
