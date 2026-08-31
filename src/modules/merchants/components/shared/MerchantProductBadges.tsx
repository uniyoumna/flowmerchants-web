type MerchantProductBadgesProps = {
  products: string[] | null;
};

const MerchantProductBadges = ({ products }: MerchantProductBadgesProps) => {
  if (!products || products.length === 0) {
    return <span className="text-slate-400 font-medium">—</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {products.map((product) => (
        <span
          key={product}
          className="inline-flex items-center rounded-lg border border-sky-200/70 bg-sky-50/80 px-2.5 py-0.5 text-xs font-medium text-sky-600 whitespace-nowrap"
        >
          {product}
        </span>
      ))}
    </div>
  );
};

export default MerchantProductBadges;
export { MerchantProductBadges };
export type { MerchantProductBadgesProps };
