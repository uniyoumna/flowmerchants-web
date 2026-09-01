import { Inbox } from "lucide-react";
import Link from "next/link";

const MerchantCreateHeader = () => {
  return (
    <div className="px-6 pt-6 pb-4 lg:px-8">
      {/* ─── Breadcrumb ─── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link
          href="/merchants"
          className="text-slate-600 transition-colors hover:text-[#7C3AED]"
        >
          Merchants
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">Add New Merchants</span>
      </nav>

      {/* ─── Title ─── */}
      <h1 className="mt-3 flex items-center gap-2.5 text-xl font-bold text-slate-900">
        <Inbox className="size-5 text-slate-700" />
        Create New Merchants
      </h1>
    </div>
  );
};

export default MerchantCreateHeader;
export { MerchantCreateHeader };
