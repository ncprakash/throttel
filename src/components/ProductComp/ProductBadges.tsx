// components/product/ProductBadges.tsx
"use client";

type ProductBadgesProps = {

  warrantyMonths: number;

};

export default function ProductBadges({
  
  warrantyMonths,
 
}: ProductBadgesProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* In Stock */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 backdrop-blur-sm bg-green-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="text-xs font-semibold text-white mb-1">In Stock</div>
        <div className="text-xs text-white/60">Ships within 24h</div>
      </div>

      {/* Warranty */}
     
      {/* Free Shipping */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 text-center">
        <div className="w-10 h-10 mx-auto mb-2 backdrop-blur-sm bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
        </div>
        <div className="text-xs font-semibold text-white mb-1">
          Free Shipping
        </div>
        <div className="text-xs text-white/60">On orders over ₹1500</div>
      </div>
    </div>
  );
}
