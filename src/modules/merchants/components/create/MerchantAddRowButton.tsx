import { Plus } from "lucide-react";

type MerchantAddRowButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

/** The "+ Add …" affordance under every repeatable collection in the wizard. */
const MerchantAddRowButton = ({
  label,
  onClick,
  disabled,
}: MerchantAddRowButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-2 rounded-lg py-1 text-sm font-semibold text-[#7C3AED] transition-colors hover:text-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex size-5 items-center justify-center rounded-md bg-purple-50">
        <Plus className="size-3.5" />
      </span>
      {label}
    </button>
  );
};

export default MerchantAddRowButton;
export { MerchantAddRowButton };
export type { MerchantAddRowButtonProps };
