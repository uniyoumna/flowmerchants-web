import { MERCHANT_STEP_META } from "../../constants";
import type { MerchantCreateStep } from "../../types";

type MerchantStepHeadingProps = {
  step: MerchantCreateStep;
};

const MerchantStepHeading = ({ step }: MerchantStepHeadingProps) => {
  const meta = MERCHANT_STEP_META[step];

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">{meta.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
    </div>
  );
};

export default MerchantStepHeading;
export { MerchantStepHeading };
export type { MerchantStepHeadingProps };
