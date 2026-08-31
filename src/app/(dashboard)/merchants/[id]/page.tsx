import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant Details",
  description: "View and edit a single merchant.",
};

type MerchantDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MerchantDetailsPage({
  params,
}: MerchantDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Merchant Details</h1>
      <p className="text-sm text-slate-500">
        Details for merchant <span className="font-mono">{id}</span> are not
        built yet.
      </p>
    </div>
  );
}
