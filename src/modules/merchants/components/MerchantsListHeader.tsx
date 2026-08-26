import { Plus } from "lucide-react";
import Link from "next/link";
import { BaseButton } from "@/components/base/BaseButton";

const MerchantsListHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Merchants List</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and add new Merchants
        </p>
      </div>

      <Link href="/merchants/new">
        <BaseButton className="h-10 rounded-xl bg-linear-to-r from-[#7C3AED] to-[#A855F7] px-4 font-semibold text-white shadow-sm hover:from-[#6D28D9] hover:to-[#9333EA] transition-all">
          <Plus className="mr-1.5 size-4" />
          Add new Merchants
        </BaseButton>
      </Link>
    </div>
  );
};

export default MerchantsListHeader;
export { MerchantsListHeader };
