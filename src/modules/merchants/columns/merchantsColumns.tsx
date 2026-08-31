import type { ColumnDef } from "@/components/table";
import { TableActions } from "@/components/table/TableActions";
import { MerchantProductBadges } from "../components/shared/MerchantProductBadges";
import { MerchantStatusBadge } from "../components/shared/MerchantStatusBadge";
import type { Merchant } from "../types";

type CreateMerchantsColumnsOptions = {
  /** Redirects to the merchant's edit page. Remaining row actions come later. */
  onEdit?: (merchant: Merchant) => void;
};

export function createMerchantsColumns({
  onEdit,
}: CreateMerchantsColumnsOptions = {}): ColumnDef<Merchant, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">
            {row.original.name}
          </span>
          <span className="text-xs text-slate-400 font-normal">
            {row.original.arabicName}
          </span>
        </div>
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
          onEdit={() => onEdit?.(row.original)}
        />
      ),
    },
  ];
}
