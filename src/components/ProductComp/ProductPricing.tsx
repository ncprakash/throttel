// components/product/ProductPricing.tsx
"use client";

type ProductPricingProps = {
  regularPrice: number;
  salePrice?: number;
  currency?: string;
};

export default function ProductPricing({
  regularPrice,
  salePrice,
  currency = "$",
}: ProductPricingProps) {
  const discount = salePrice
    ? Math.round((1 - salePrice / regularPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {salePrice ? (
        <>
          <span className="text-4xl sm:text-5xl font-bold text-green-400">
            {currency}{salePrice.toFixed(2)}
          </span>
          <span className="text-xl sm:text-2xl text-red-400 line-through">
            {currency}{regularPrice.toFixed(2)}
          </span>
          <span className="backdrop-blur-md bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-lg text-sm font-bold text-red-400">
            {discount}% OFF
          </span>
        </>
      ) : (
        <span className="text-4xl sm:text-5xl font-bold text-white">
          {currency}{regularPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}
