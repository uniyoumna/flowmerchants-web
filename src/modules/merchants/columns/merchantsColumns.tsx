import Link from "next/link";
import type { ColumnDef } from "@/components/table";
import { TableActions } from "@/components/table/TableActions";
import { MerchantProductBadges } from "../components/shared/MerchantProductBadges";
import { MerchantStatusBadge } from "../components/shared/MerchantStatusBadge";
import type { Merchant } from "../types";
import { merchantDetailPath } from "../utils/merchantDetailQuery";

type CreateMerchantsColumnsOptions = {
  /** Opens the merchant in the onboarding wizard. Other row actions come later. */
  onEdit?: (merchant: Merchant) => void;
  /** Opens the merchant's detail screen from the row menu. */
  onView?: (merchant: Merchant) => void;
};

export function createMerchantsColumns({
  onEdit,
  onView,
}: CreateMerchantsColumnsOptions = {}): ColumnDef<Merchant, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Type",
      cell: ({ row }) => (
        <Link
          href={merchantDetailPath(row.original.id)}
          className="flex flex-col gap-0.5 rounded-sm transition-colors hover:text-[#7C3AED] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
        >
          <span className="font-semibold text-slate-900 hover:text-[#7C3AED]">
            {row.original.name}
          </span>
          <span className="text-xs font-normal text-slate-400">
            {row.original.arabicName}
          </span>
        </Link>
      ),
    },
    {
      accessorKey: "code",
      header: "Merchant Code",
      cell: ({ row }) => {
        if (!row.original.code) {
          return <span className="text-slate-400 font-medium">—</span>;
        }
        return (
          <span className="inline-flex rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-mono font-medium text-slate-700">
            {row.original.code}
          </span>
        );
      },
    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row }) => (
        <MerchantProductBadges products={row.original.products} />
      ),
    },
    {
      accessorKey: "businessType",
      header: "Business Types",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">
          {row.original.businessType}
        </span>
      ),
    },
    {
      accessorKey: "owner",
      header: "Acquisition Owner",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.owner}</span>
      ),
    },
    {
      accessorKey: "branches",
      header: "Branches",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700">
          {row.original.branches}
        </span>
      ),
    },
    {
      accessorKey: "expiry",
      header: "Expiry",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700 font-mono">
          {row.original.expiry ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "joiningDate",
      header: "Joining Date",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700 font-mono">
          {row.original.joiningDate}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <MerchantStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableActions
          variant="dropdown"
          onView={() => onView?.(row.original)}
          onEdit={() => onEdit?.(row.original)}
        />
      ),
    },
  ];
}
