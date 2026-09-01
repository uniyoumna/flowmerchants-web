import { AlertTriangle } from "lucide-react";

type MerchantStepLoadErrorProps = {
  message: string;
};

/** Shown when a saved step cannot be read back — the draft itself is intact. */
const MerchantStepLoadError = ({ message }: MerchantStepLoadErrorProps) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-6">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-rose-500" />

      <div>
        <p className="text-sm font-semibold text-rose-700">
          We could not load this step
        </p>
        <p className="mt-1 text-sm text-rose-600">{message}</p>
        <p className="mt-2 text-xs text-rose-500">
          Your saved progress is safe — refresh the page to try again.
        </p>
      </div>
    </div>
  );
};

export default MerchantStepLoadError;
export { MerchantStepLoadError };
export type { MerchantStepLoadErrorProps };
